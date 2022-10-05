package gropius.service.issue

import gropius.authorization.GropiusAuthorizationContext
import gropius.dto.input.issue.AddArtefactToIssueInput
import gropius.dto.input.issue.AddLabelToIssueInput
import gropius.dto.input.issue.RemoveArtefactFromIssueInput
import gropius.dto.input.issue.RemoveLabelFromIssueInput
import gropius.model.issue.Artefact
import gropius.model.issue.Issue
import gropius.model.issue.Label
import gropius.model.issue.timeline.*
import gropius.model.user.User
import gropius.model.user.permission.NodePermission
import gropius.model.user.permission.TrackablePermission
import gropius.repository.findById
import gropius.repository.issue.ArtefactRepository
import gropius.repository.issue.IssueRepository
import gropius.repository.issue.LabelRepository
import gropius.repository.issue.timeline.TimelineItemRepository
import gropius.service.common.AuditedNodeService
import io.github.graphglue.authorization.Permission
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.Collections

/**
 * Service for [Issue]s. Provides function to update the deprecation status
 *
 * @param repository the associated repository used for CRUD functionality
 * @param labelRepository used to find [Label]s by id
 * @param timelineItemRepository used to save [TimelineItem]s
 * @param artefactRepository used to find [Artefact]s by id
 */
@Service
class IssueService(
    repository: IssueRepository,
    private val labelRepository: LabelRepository,
    private val timelineItemRepository: TimelineItemRepository,
    private val artefactRepository: ArtefactRepository
) : AuditedNodeService<Issue, IssueRepository>(repository) {

    /**
     * Deletes an [Issue]
     * Does not check the authorization status
     *
     * @param node the Issue to delete
     */
    suspend fun deleteIssue(node: Issue) {
        node.isDeleted = true
        repository.save(node).awaitSingle()
    }

    /**
     * Adds a [Label] to an [Issue], returns the created [AddedLabelEvent], or `null` if the [Label] was already
     * present on the [Issue].
     * Checks the authorization status, checks that the [Label] can be added to the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Label] to add to which [Issue]
     * @return the saved created [AddedLabelEvent] or `null` if no event was created
     */
    suspend fun addLabelToIssue(
        authorizationContext: GropiusAuthorizationContext, input: AddLabelToIssueInput
    ): AddedLabelEvent? {
        val issue = repository.findById(input.issue)
        val label = labelRepository.findById(input.label)
        checkPermission(issue, Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext), "manage the Issue")
        checkPermission(label, Permission(NodePermission.READ, authorizationContext), "use the Label")
        if (Collections.disjoint(issue.trackables(), label.trackables())) {
            throw IllegalStateException("The Label cannot be added to the Issue as no common Trackable exists")
        }
        return if (label !in issue.labels()) {
            return timelineItemRepository.save(
                addLabelToIssue(issue, label, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Adds a [label] to an [issue] at [atTime] as [byUser] and adds a [AddedLabelEvent] to the timeline.
     * Creates the event even if the [label] was already on the [issue].
     * Only adds the [label] to the [issue] if no newer timeline item exists which removes it again.
     * Does not check the authorization status, and does not check if the [label] can be added to this [issue].
     * Does neither save the created [AddedLabelEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedLabelEvent] afterwards.
     *
     * @param issue the [Issue] where [label] is added to
     * @param label the [Label] to add
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     */
    suspend fun addLabelToIssue(
        issue: Issue, label: Label, atTime: OffsetDateTime, byUser: User
    ): AddedLabelEvent {
        val event = AddedLabelEvent(atTime, atTime)
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<RemovedLabelEvent>(issue, atTime) { it.removedLabel().value == label }) {
            issue.labels() += label
        }
        return event
    }

    /**
     * Removes a [Label] from an [Issue], returns the created [RemovedLabelEvent], or `null` if the [Label] was not
     * present on the [Issue].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Label] to remove from which [Issue]
     * @return the saved created [RemovedLabelEvent] or `null` if no event was created
     */
    suspend fun removeLabelFromIssue(
        authorizationContext: GropiusAuthorizationContext, input: RemoveLabelFromIssueInput
    ): RemovedLabelEvent? {
        val issue = repository.findById(input.issue)
        val label = labelRepository.findById(input.label)
        checkPermission(issue, Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext), "manage the Issue")
        return if (label in issue.labels()) {
            return timelineItemRepository.save(
                removeLabelFromIssue(issue, label, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Removes a [label] from an [issue] at [atTime] as [byUser] and adds a [RemovedLabelEvent] to the timeline.
     * Creates the event even if the [label] was not on the [issue].
     * Only removes the [label] from the [issue] if no newer timeline item exists which adds it again.
     * Does not check the authorization status.
     * Does neither save the created [RemovedLabelEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [RemovedLabelEvent] afterwards.
     *
     * @param issue the [Issue] where [label] is removed from
     * @param label the [Label] to remove
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     */
    suspend fun removeLabelFromIssue(
        issue: Issue, label: Label, atTime: OffsetDateTime, byUser: User
    ): RemovedLabelEvent {
        val event = RemovedLabelEvent(atTime, atTime)
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedLabelEvent>(issue, atTime) { it.addedLabel().value == label }) {
            issue.labels() -= label
        }
        return event
    }

    /**
     * Adds a [Artefact] to an [Issue], returns the created [AddedArtefactEvent], or `null` if the [Artefact] was already
     * present on the [Issue].
     * Checks the authorization status, checks that the [Artefact] can be added to the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Artefact] to add to which [Issue]
     * @return the saved created [AddedArtefactEvent] or `null` if no event was created
     */
    suspend fun addArtefactToIssue(
        authorizationContext: GropiusAuthorizationContext, input: AddArtefactToIssueInput
    ): AddedArtefactEvent? {
        val issue = repository.findById(input.issue)
        val artefact = artefactRepository.findById(input.artefact)
        checkPermission(issue, Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext), "manage the Issue")
        checkPermission(artefact, Permission(NodePermission.READ, authorizationContext), "use the Artefact")
        if (artefact.trackable().value !in issue.trackables()) {
            throw IllegalStateException("The Artefact is not part of a Trackable the Issue is on")
        }
        return if (artefact !in issue.artefacts()) {
            return timelineItemRepository.save(
                addArtefactToIssue(issue, artefact, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Adds a [artefact] to an [issue] at [atTime] as [byUser] and adds a [AddedArtefactEvent] to the timeline.
     * Creates the event even if the [artefact] was already on the [issue].
     * Only adds the [artefact] to the [issue] if no newer timeline item exists which removes it again.
     * Does not check the authorization status, and does not check if the [artefact] can be added to this [issue].
     * Does neither save the created [AddedArtefactEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedArtefactEvent] afterwards.
     *
     * @param issue the [Issue] where [artefact] is added to
     * @param artefact the [Artefact] to add
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     */
    suspend fun addArtefactToIssue(
        issue: Issue, artefact: Artefact, atTime: OffsetDateTime, byUser: User
    ): AddedArtefactEvent {
        val event = AddedArtefactEvent(atTime, atTime)
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<RemovedArtefactEvent>(issue, atTime) { it.removedArtefact().value == artefact }) {
            issue.artefacts() += artefact
        }
        return event
    }

    /**
     * Removes a [Artefact] from an [Issue], returns the created [RemovedArtefactEvent], or `null` if the [Artefact] was not
     * present on the [Issue].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Artefact] to remove from which [Issue]
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun removeArtefactFromIssue(
        authorizationContext: GropiusAuthorizationContext, input: RemoveArtefactFromIssueInput
    ): RemovedArtefactEvent? {
        val issue = repository.findById(input.issue)
        val artefact = artefactRepository.findById(input.artefact)
        checkPermission(issue, Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext), "manage the Issue")
        return if (artefact in issue.artefacts()) {
            return timelineItemRepository.save(
                removeArtefactFromIssue(issue, artefact, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Removes a [artefact] from an [issue] at [atTime] as [byUser] and adds a [RemovedArtefactEvent] to the timeline.
     * Creates the event even if the [artefact] was not on the [issue].
     * Only removes the [artefact] from the [issue] if no newer timeline item exists which adds it again.
     * Does not check the authorization status.
     * Does neither save the created [RemovedArtefactEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [RemovedArtefactEvent] afterwards.
     *
     * @param issue the [Issue] where [artefact] is removed from
     * @param artefact the [Artefact] to remove
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     */
    suspend fun removeArtefactFromIssue(
        issue: Issue, artefact: Artefact, atTime: OffsetDateTime, byUser: User
    ): RemovedArtefactEvent {
        val event = RemovedArtefactEvent(atTime, atTime)
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedArtefactEvent>(issue, atTime) { it.addedArtefact().value == artefact }) {
            issue.artefacts() -= artefact
        }
        return event
    }

    /**
     * Called after a [TimelineItem] was created
     * Adds it to the [issue], calls [createdAuditedNode] and updates [Issue.lastUpdatedAt] and [Issue.participants].
     * Also sets [TimelineItem.issue], to allow to save [timelineItem] instead of [issue].
     *
     * @param issue associated [Issue] to which [timelineItem] should be added
     * @param timelineItem the created [TimelineItem]
     * @param atTime point in time at which [timelineItem] was created
     * @param byUser the [User] who created [timelineItem]
     */
    private suspend fun createdTimelineItem(
        issue: Issue, timelineItem: TimelineItem, atTime: OffsetDateTime, byUser: User
    ) {
        createdAuditedNode(timelineItem, byUser)
        timelineItem.issue().value = issue
        issue.timelineItems() += timelineItem
        issue.participants() += byUser
        issue.lastUpdatedAt = maxOf(issue.lastUpdatedAt, atTime)
    }

    /**
     * Checks if a [TimelineItem] with type [T] exists on [issue] created after [time] matching [itemFilter]
     *
     * @param T the type of [TimelineItem] to look for
     * @param issue contains the timeline to check
     * @param time only consider items after this time
     * @param itemFilter used to further filter for acceptable [TimelineItem]s
     * @return the result of the check
     */
    private suspend inline fun <reified T : TimelineItem> existsNewerTimelineItem(
        issue: Issue, time: OffsetDateTime, itemFilter: (T) -> Boolean
    ): Boolean {
        return issue.timelineItems().any {
            (it is T) && (it.createdAt > time) && itemFilter(it)
        }
    }

}