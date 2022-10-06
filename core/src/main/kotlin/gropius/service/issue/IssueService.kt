package gropius.service.issue

import gropius.authorization.GropiusAuthorizationContext
import gropius.dto.input.issue.*
import gropius.model.architecture.AffectedByIssue
import gropius.model.architecture.Trackable
import gropius.model.issue.Artefact
import gropius.model.issue.Issue
import gropius.model.issue.Label
import gropius.model.issue.timeline.*
import gropius.model.template.IssuePriority
import gropius.model.template.IssueState
import gropius.model.template.IssueType
import gropius.model.user.User
import gropius.model.user.permission.NodePermission
import gropius.model.user.permission.TrackablePermission
import gropius.repository.architecture.AffectedByIssueRepository
import gropius.repository.architecture.TrackableRepository
import gropius.repository.findById
import gropius.repository.issue.ArtefactRepository
import gropius.repository.issue.IssueRepository
import gropius.repository.issue.LabelRepository
import gropius.repository.issue.timeline.TimelineItemRepository
import gropius.repository.template.IssuePriorityRepository
import gropius.repository.template.IssueStateRepository
import gropius.repository.template.IssueTypeRepository
import gropius.service.common.AuditedNodeService
import io.github.graphglue.authorization.Permission
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.OffsetDateTime
import java.util.*
import kotlin.reflect.KMutableProperty0

/**
 * Service for [Issue]s. Provides function to update the deprecation status
 *
 * @param repository the associated repository used for CRUD functionality
 * @param labelRepository used to find [Label]s by id
 * @param timelineItemRepository used to save [TimelineItem]s
 * @param artefactRepository used to find [Artefact]s by id
 * @param trackableRepository used to find [Trackable]s by id
 * @param issuePriorityRepository used to find [IssuePriority]s by id
 * @param issueTypeRepository used to find [IssueType]s by id
 * @param issueStateRepository used to find [IssueState]s by id
 * @param affectedByIssueRepository used to find [AffectedByIssue]s by id
 */
@Service
class IssueService(
    repository: IssueRepository,
    private val labelRepository: LabelRepository,
    private val timelineItemRepository: TimelineItemRepository,
    private val artefactRepository: ArtefactRepository,
    private val trackableRepository: TrackableRepository,
    private val issuePriorityRepository: IssuePriorityRepository,
    private val issueTypeRepository: IssueTypeRepository,
    private val issueStateRepository: IssueStateRepository,
    private val affectedByIssueRepository: AffectedByIssueRepository
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
     * Adds an [Issue] to a [Trackable], returns the created [AddedToTrackableEvent],
     * or `null` if the [Issue] was already on the [Trackable].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Issue] to add to which [Trackable]
     * @return the saved created [AddedToTrackableEvent] or `null` if no event was created
     */
    suspend fun addIssueToTrackable(
        authorizationContext: GropiusAuthorizationContext, input: AddIssueToTrackableInput
    ): AddedToTrackableEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val trackable = trackableRepository.findById(input.trackable)
        checkPermission(
            trackable,
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable"
        )
        checkManageIssuesPermission(issue, authorizationContext)
        return if (trackable !in issue.trackables()) {
            return timelineItemRepository.save(
                addIssueToTrackable(issue, trackable, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Adds an [issue] to a [trackable] at [atTime] as [byUser] and adds a [AddedToTrackableEvent] to the timeline.
     * Creates the event even if the [issue] was already on the [trackable].
     * Only adds the [issue] to the [trackable] if no newer timeline item exists which removes it again.
     * Does not check the authorization status.
     * Does neither save the created [AddedToTrackableEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedToTrackableEvent] afterwards.
     *
     * @param issue the [Issue] to add to [trackable]
     * @param trackable the [Trackable] where the [issue] should be added
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [AddedToTrackableEvent]
     */
    suspend fun addIssueToTrackable(
        issue: Issue, trackable: Trackable, atTime: OffsetDateTime, byUser: User
    ): AddedToTrackableEvent {
        val event = AddedToTrackableEvent(atTime, atTime)
        event.addedToTrackable().value = trackable
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<RemovedFromTrackableEvent>(
                issue, atTime
            ) { it.removedFromTrackable().value == trackable }
        ) {
            issue.trackables() += trackable
        }
        return event
    }

    /**
     * Removes an [Issue] from a [Trackable], returns the created [RemovedFromPinnedIssuesEvent],
     * or `null` if the [Issue] was not pinned on the [Trackable].
     * Also removes [Label]s and [Artefact]s if necessary, and unpins it on the specified [Trackable].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Issue] to remove from which [Trackable]
     * @return the saved created [RemovedFromTrackableEvent] or `null` if no event was created
     */
    suspend fun removeIssueFromTrackable(
        authorizationContext: GropiusAuthorizationContext, input: RemoveIssueFromTrackableInput
    ): RemovedFromTrackableEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val trackable = trackableRepository.findById(input.trackable)
        checkPermission(
            trackable,
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable"
        )
        return if (trackable in issue.trackables()) {
            return timelineItemRepository.save(
                removeIssueFromTrackable(issue, trackable, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Removes an [issue] from a [trackable] at [atTime] as [byUser] and adds a [RemovedFromTrackableEvent]
     * to the timeline.
     * Also removes [Label]s and [Artefact]s if necessary, and unpins it on the specified [Trackable].
     * Creates the event even if the [issue] was not on the [trackable].
     * Only removes the [issue] from the [trackable] if no newer timeline item exists which adds it again.
     * Does not check the authorization status.
     * Does neither save the created [RemovedFromTrackableEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [RemovedFromTrackableEvent] afterwards.
     *
     * @param issue the [Issue] to remove from [trackable]
     * @param trackable the [Trackable] where [issue] should be removed
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [RemovedFromTrackableEvent]
     */
    suspend fun removeIssueFromTrackable(
        issue: Issue, trackable: Trackable, atTime: OffsetDateTime, byUser: User
    ): RemovedFromTrackableEvent {
        val event = RemovedFromTrackableEvent(atTime, atTime)
        event.removedFromTrackable().value = trackable
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedToTrackableEvent>(
                issue, atTime
            ) { it.addedToTrackable().value == trackable }
        ) {
            issue.trackables() -= trackable
            var timeOffset = 0L
            if (trackable in issue.pinnedOn()) {
                event.childItems() += removeIssueFromPinnedIssues(
                    issue, trackable, atTime.plusNanos(timeOffset++), byUser
                )
            }
            event.childItems() += issue.artefacts().filter { it.trackable().value == trackable }
                .map { removeArtefactFromIssue(issue, it, atTime.plusNanos(timeOffset++), byUser) }
            event.childItems() += issue.labels().filter { Collections.disjoint(issue.trackables(), it.trackables()) }
                .map { removeLabelFromIssue(issue, it, atTime.plusNanos(timeOffset++), byUser) }
            event.childItems() += issue.affects().filter { it.relatedTrackable() == trackable }
                .map { removeAffectedEntityFromIssue(issue, it, atTime.plusNanos(timeOffset), byUser) }
        }
        return event
    }

    /**
     * Pins an [Issue] on a [Trackable], returns the created [AddedToPinnedIssuesEvent],
     * or `null` if the [Issue] was already pinned on the [Trackable].
     * Checks the authorization status, checks that the [Issue] can be pinned on the [Trackable]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Issue] to pin on which [Trackable]
     * @return the saved created [AddedToPinnedIssuesEvent] or `null` if no event was created
     */
    suspend fun addIssueToPinnedIssues(
        authorizationContext: GropiusAuthorizationContext, input: AddIssueToPinnedIssuesInput
    ): AddedToPinnedIssuesEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val trackable = trackableRepository.findById(input.trackable)
        checkPermission(
            trackable,
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable where the Issue should be pinned"
        )
        return if (trackable !in issue.pinnedOn()) {
            return timelineItemRepository.save(
                addIssueToPinnedIssues(issue, trackable, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Pins an [issue] on [trackable] at [atTime] as [byUser] and adds a [AddedToPinnedIssuesEvent]
     * to the timeline.
     * Creates the event even if the [issue] was already pinned on the [trackable].
     * Only adds the [issue] to the `pinnedIssues` on  [trackable] if no newer timeline item exists which removes
     * it again.
     * Does not check the authorization status.
     * Checks if the [issue] can be pinned to this [trackable].
     * Does neither save the created [AddedToPinnedIssuesEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedToPinnedIssuesEvent] afterwards.
     *
     * @param issue the [Issue] to pin
     * @param trackable the [Trackable] where the [issue] should be pinned
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [AddedToPinnedIssuesEvent]
     * @throws IllegalArgumentException if [issue] cannot be pinned on [trackable]
     */
    suspend fun addIssueToPinnedIssues(
        issue: Issue, trackable: Trackable, atTime: OffsetDateTime, byUser: User
    ): AddedToPinnedIssuesEvent {
        if (trackable !in issue.trackables()) {
            throw IllegalArgumentException("The Issue cannot be pinned on the Trackable as it is not on the Trackable")
        }
        val event = AddedToPinnedIssuesEvent(atTime, atTime)
        event.pinnedOn().value = trackable
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<RemovedFromPinnedIssuesEvent>(
                issue, atTime
            ) { it.unpinnedOn().value == trackable }
        ) {
            issue.pinnedOn() += trackable
        }
        return event
    }

    /**
     * Unpins an [Issue] on a [Trackable], returns the created [RemovedFromPinnedIssuesEvent],
     * or `null` if the [Issue] was not pinned on the [Trackable].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [Issue] to unpin on which [Trackable]
     * @return the saved created [RemovedFromPinnedIssuesEvent] or `null` if no event was created
     */
    suspend fun removeIssueFromPinnedIssues(
        authorizationContext: GropiusAuthorizationContext, input: RemoveIssueFromPinnedIssuesInput
    ): RemovedFromPinnedIssuesEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val trackable = trackableRepository.findById(input.trackable)
        checkPermission(
            trackable,
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable where the Issue should be unpinned"
        )
        return if (trackable in issue.pinnedOn()) {
            return timelineItemRepository.save(
                removeIssueFromPinnedIssues(issue, trackable, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Unpins an [issue] on a [trackable] at [atTime] as [byUser] and adds a [RemovedFromPinnedIssuesEvent]
     * to the timeline.
     * Creates the event even if the [issue] was not pinned on the [trackable].
     * Only removes the [issue] from the `pinnedIssues` on [trackable] if no newer timeline item exists which
     * adds it again.
     * Does not check the authorization status.
     * Does neither save the created [RemovedFromPinnedIssuesEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [RemovedFromPinnedIssuesEvent] afterwards.
     *
     * @param issue the [Issue] to unpin
     * @param trackable the [Trackable] where [issue] should be unpinned
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [RemovedFromPinnedIssuesEvent]
     */
    suspend fun removeIssueFromPinnedIssues(
        issue: Issue, trackable: Trackable, atTime: OffsetDateTime, byUser: User
    ): RemovedFromPinnedIssuesEvent {
        val event = RemovedFromPinnedIssuesEvent(atTime, atTime)
        event.unpinnedOn().value = trackable
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedToPinnedIssuesEvent>(issue, atTime) { it.pinnedOn().value == trackable }) {
            issue.pinnedOn() -= trackable
        }
        return event
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
        input.validate()
        val issue = repository.findById(input.issue)
        val label = labelRepository.findById(input.label)
        checkManageIssuesPermission(issue, authorizationContext)
        checkPermission(label, Permission(NodePermission.READ, authorizationContext), "use the Label")
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
     * Does not check the authorization status.
     * Checks if the [label] can be added to this [issue].
     * Does neither save the created [AddedLabelEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedLabelEvent] afterwards.
     *
     * @param issue the [Issue] where [label] is added to
     * @param label the [Label] to add
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [AddedLabelEvent]
     * @throws IllegalArgumentException if [label] cannot be added to [issue]
     */
    suspend fun addLabelToIssue(
        issue: Issue, label: Label, atTime: OffsetDateTime, byUser: User
    ): AddedLabelEvent {
        if (Collections.disjoint(issue.trackables(), label.trackables())) {
            throw IllegalArgumentException("The Label cannot be added to the Issue as no common Trackable exists")
        }
        val event = AddedLabelEvent(atTime, atTime)
        event.addedLabel().value = label
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
        input.validate()
        val issue = repository.findById(input.issue)
        val label = labelRepository.findById(input.label)
        checkManageIssuesPermission(issue, authorizationContext)
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
     * @return the created [RemovedLabelEvent]
     */
    suspend fun removeLabelFromIssue(
        issue: Issue, label: Label, atTime: OffsetDateTime, byUser: User
    ): RemovedLabelEvent {
        val event = RemovedLabelEvent(atTime, atTime)
        event.removedLabel().value = label
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
        input.validate()
        val issue = repository.findById(input.issue)
        val artefact = artefactRepository.findById(input.artefact)
        checkManageIssuesPermission(issue, authorizationContext)
        checkPermission(artefact, Permission(NodePermission.READ, authorizationContext), "use the Artefact")
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
     * Does not check the authorization status.
     * Check if the [artefact] can be added to this [issue].
     * Does neither save the created [AddedArtefactEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedArtefactEvent] afterwards.
     *
     * @param issue the [Issue] where [artefact] is added to
     * @param artefact the [Artefact] to add
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the crated [AddedArtefactEvent]
     * @throws IllegalArgumentException if the [artefact] cannot be added to the [issue]
     */
    suspend fun addArtefactToIssue(
        issue: Issue, artefact: Artefact, atTime: OffsetDateTime, byUser: User
    ): AddedArtefactEvent {
        if (artefact.trackable().value !in issue.trackables()) {
            throw IllegalArgumentException("The Artefact is not part of a Trackable the Issue is on")
        }
        val event = AddedArtefactEvent(atTime, atTime)
        event.addedArtefact().value = artefact
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
        input.validate()
        val issue = repository.findById(input.issue)
        val artefact = artefactRepository.findById(input.artefact)
        checkManageIssuesPermission(issue, authorizationContext)
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
     * @return the created [RemovedArtefactEvent]
     */
    suspend fun removeArtefactFromIssue(
        issue: Issue, artefact: Artefact, atTime: OffsetDateTime, byUser: User
    ): RemovedArtefactEvent {
        val event = RemovedArtefactEvent(atTime, atTime)
        event.removedArtefact().value = artefact
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedArtefactEvent>(issue, atTime) { it.addedArtefact().value == artefact }) {
            issue.artefacts() -= artefact
        }
        return event
    }

    /**
     * Changes the `title` of an [Issue], return the created [TitleChangedEvent] or null if the `title`
     * was not changed.
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `title` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueTitle(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueTitleInput
    ): TitleChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        return changeIssueProperty(authorizationContext, issue, issue.title, input.title, ::changeIssueTitle)
    }

    /**
     * Changes the `title` of an  [issue] at [atTime] as [byUser] and adds a [TitleChangedEvent] to the timeline.
     * Creates the event even if the `title` was not changed.
     * Only changes the `title` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the created [TitleChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [TitleChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `title` should be changed
     * @param oldTitle the old `title`
     * @param newTitle the new `title`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [TitleChangedEvent]
     */
    suspend fun changeIssueTitle(
        issue: Issue, oldTitle: String, newTitle: String, atTime: OffsetDateTime, byUser: User
    ): TitleChangedEvent {
        val event = TitleChangedEvent(atTime, atTime, oldTitle, newTitle)
        changeIssueProperty(issue, newTitle, atTime, byUser, issue::title, event)
        return event
    }

    /**
     * Changes the `startDate` of an [Issue], return the created [StartDateChangedEvent] or null if the `startDate`
     * was not changed.
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `startDate` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueStartDate(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueStartDateInput
    ): StartDateChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        return changeIssueProperty(
            authorizationContext, issue, issue.startDate, input.startDate, ::changeIssueStartDate
        )
    }

    /**
     * Changes the `startDate` of an  [issue] at [atTime] as [byUser] and adds a [StartDateChangedEvent] to the timeline.
     * Creates the event even if the `startDate` was not changed.
     * Only changes the `startDate` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the created [StartDateChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [StartDateChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `startDate` should be changed
     * @param oldStartDate the old `startDate`
     * @param newStartDate the new `startDate`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [StartDateChangedEvent]
     */
    suspend fun changeIssueStartDate(
        issue: Issue, oldStartDate: OffsetDateTime?, newStartDate: OffsetDateTime?, atTime: OffsetDateTime, byUser: User
    ): StartDateChangedEvent {
        val event = StartDateChangedEvent(atTime, atTime, oldStartDate, newStartDate)
        changeIssueProperty(issue, newStartDate, atTime, byUser, issue::startDate, event)
        return event
    }

    /**
     * Changes the `dueDate` of an [Issue], return the created [DueDateChangedEvent] or null if the `dueDate`
     * was not changed.
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `dueDate` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueDueDate(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueDueDateInput
    ): DueDateChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        return changeIssueProperty(
            authorizationContext, issue, issue.dueDate, input.dueDate, ::changeIssueDueDate
        )
    }

    /**
     * Changes the `dueDate` of an  [issue] at [atTime] as [byUser] and adds a [DueDateChangedEvent] to the timeline.
     * Creates the event even if the `dueDate` was not changed.
     * Only changes the `dueDate` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the created [DueDateChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [DueDateChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `dueDate` should be changed
     * @param oldDueDate the old `dueDate`
     * @param newDueDate the new `dueDate`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [DueDateChangedEvent]
     */
    suspend fun changeIssueDueDate(
        issue: Issue, oldDueDate: OffsetDateTime?, newDueDate: OffsetDateTime?, atTime: OffsetDateTime, byUser: User
    ): DueDateChangedEvent {
        val event = DueDateChangedEvent(atTime, atTime, oldDueDate, newDueDate)
        changeIssueProperty(issue, newDueDate, atTime, byUser, issue::dueDate, event)
        return event
    }

    /**
     * Changes the `estimatedTime` of an [Issue], return the created [EstimatedTimeChangedEvent] or null if the `estimatedTime`
     * was not changed.
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `estimatedTime` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueEstimatedTime(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueEstimatedTimeInput
    ): EstimatedTimeChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        return changeIssueProperty(
            authorizationContext, issue, issue.estimatedTime, input.estimatedTime, ::changeIssueEstimatedTime
        )
    }

    /**
     * Changes the `estimatedTime` of an  [issue] at [atTime] as [byUser] and adds a [EstimatedTimeChangedEvent] to the timeline.
     * Creates the event even if the `estimatedTime` was not changed.
     * Only changes the `estimatedTime` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the created [EstimatedTimeChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [EstimatedTimeChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `estimatedTime` should be changed
     * @param oldEstimatedTime the old `estimatedTime`
     * @param newEstimatedTime the new `estimatedTime`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [EstimatedTimeChangedEvent]
     */
    suspend fun changeIssueEstimatedTime(
        issue: Issue, oldEstimatedTime: Duration?, newEstimatedTime: Duration?, atTime: OffsetDateTime, byUser: User
    ): EstimatedTimeChangedEvent {
        val event = EstimatedTimeChangedEvent(atTime, atTime, oldEstimatedTime, newEstimatedTime)
        changeIssueProperty(issue, newEstimatedTime, atTime, byUser, issue::estimatedTime, event)
        return event
    }

    /**
     * Changes the `spentTime` of an [Issue], return the created [SpentTimeChangedEvent] or null if the `spentTime`
     * was not changed.
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `spentTime` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueSpentTime(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueSpentTimeInput
    ): SpentTimeChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        return changeIssueProperty(
            authorizationContext, issue, issue.spentTime, input.spentTime, ::changeIssueSpentTime
        )
    }

    /**
     * Changes the `spentTime` of an  [issue] at [atTime] as [byUser] and adds a [SpentTimeChangedEvent] to the timeline.
     * Creates the event even if the `spentTime` was not changed.
     * Only changes the `spentTime` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the created [SpentTimeChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [SpentTimeChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `spentTime` should be changed
     * @param oldSpentTime the old `spentTime`
     * @param newSpentTime the new `spentTime`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [SpentTimeChangedEvent]
     */
    suspend fun changeIssueSpentTime(
        issue: Issue, oldSpentTime: Duration?, newSpentTime: Duration?, atTime: OffsetDateTime, byUser: User
    ): SpentTimeChangedEvent {
        val event = SpentTimeChangedEvent(atTime, atTime, oldSpentTime, newSpentTime)
        changeIssueProperty(issue, newSpentTime, atTime, byUser, issue::spentTime, event)
        return event
    }

    /**
     * Changes the `priority` of an [Issue], return the created [PriorityChangedEvent] or null if the `priority`
     * was not changed.
     * Checks the authorization status, and check that the new [IssuePriority] can be used on the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `priority` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssuePriority(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssuePriorityInput
    ): PriorityChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val priority = input.priority?.let { issuePriorityRepository.findById(it) }
        return changeIssueProperty(authorizationContext, issue, issue.priority().value, priority, ::changeIssuePriority)
    }

    /**
     * Changes the `priority` of an  [issue] at [atTime] as [byUser] and adds a [PriorityChangedEvent] to the timeline.
     * Creates the event even if the `priority` was not changed.
     * Only changes the `priority` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Checks that the [newPriority] can be used on the [issue].
     * Does neither save the created [PriorityChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [PriorityChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `priority` should be changed
     * @param oldPriority the old `priority`
     * @param newPriority the new `priority`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [PriorityChangedEvent]
     */
    suspend fun changeIssuePriority(
        issue: Issue, oldPriority: IssuePriority?, newPriority: IssuePriority?, atTime: OffsetDateTime, byUser: User
    ): PriorityChangedEvent {
        if ((newPriority != null) && (issue.template().value !in newPriority.partOf())) {
            throw IllegalArgumentException(
                "IssuePriority cannot be used on the Issue as it is not provided by the template of the Issue"
            )
        }
        val event = PriorityChangedEvent(atTime, atTime)
        event.newPriority().value = newPriority
        event.oldPriority().value = oldPriority
        changeIssueProperty(issue, newPriority, atTime, byUser, issue.priority()::value, event)
        return event
    }

    /**
     * Changes the `state` of an [Issue], return the created [StateChangedEvent] or null if the `state`
     * was not changed.
     * Checks the authorization status, and checks that the new [IssueState] can be used on the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `state` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueState(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueStateInput
    ): StateChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val state = issueStateRepository.findById(input.state)
        return changeIssueProperty(authorizationContext, issue, issue.state().value, state, ::changeIssueState)
    }

    /**
     * Changes the `state` of an  [issue] at [atTime] as [byUser] and adds a [StateChangedEvent] to the timeline.
     * Creates the event even if the `state` was not changed.
     * Only changes the `state` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Checks that the [newState] can be used with the [issue].
     * Does neither save the created [StateChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [StateChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `state` should be changed
     * @param oldState the old `state`
     * @param newState the new `state`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [StateChangedEvent]
     */
    suspend fun changeIssueState(
        issue: Issue, oldState: IssueState, newState: IssueState, atTime: OffsetDateTime, byUser: User
    ): StateChangedEvent {
        if (issue.template().value !in newState.partOf()) {
            throw IllegalArgumentException(
                "IssueState cannot be used on the Issue as it is not provided by the template of the Issue"
            )
        }
        val event = StateChangedEvent(atTime, atTime)
        event.newState().value = newState
        event.oldState().value = oldState
        changeIssueProperty(issue, newState, atTime, byUser, issue.state()::value, event)
        return event
    }

    /**
     * Changes the `type` of an [Issue], return the created [TypeChangedEvent] or null if the `type`
     * was not changed.
     * Checks the authorization status, and checks that the new [IssueType] can be used with the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines the new `type` and of which issue to change it
     * @return the saved created [RemovedArtefactEvent] or `null` if no event was created
     */
    suspend fun changeIssueType(
        authorizationContext: GropiusAuthorizationContext, input: ChangeIssueTypeInput
    ): TypeChangedEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val type = issueTypeRepository.findById(input.type)
        return changeIssueProperty(authorizationContext, issue, issue.type().value, type, ::changeIssueType)
    }

    /**
     * Changes the `type` of an  [issue] at [atTime] as [byUser] and adds a [TypeChangedEvent] to the timeline.
     * Creates the event even if the `type` was not changed.
     * Only changes the `type` if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Checks that the [newType] can be used with the [issue].
     * Does neither save the created [TypeChangedEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [TypeChangedEvent] afterwards.
     *
     * @param issue the [Issue] where the `type` should be changed
     * @param oldType the old `type`
     * @param newType the new `type`
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [TypeChangedEvent]
     */
    suspend fun changeIssueType(
        issue: Issue, oldType: IssueType, newType: IssueType, atTime: OffsetDateTime, byUser: User
    ): TypeChangedEvent {
        if (issue.template().value !in newType.partOf()) {
            throw IllegalArgumentException(
                "IssueType cannot be used on the Issue as it is not provided by the template of the Issue"
            )
        }
        val event = TypeChangedEvent(atTime, atTime)
        event.newType().value = newType
        event.oldType().value = oldType
        changeIssueProperty(issue, newType, atTime, byUser, issue.type()::value, event)
        return event
    }

    /**
     * Adds an [AffectedByIssue] to an [Issue], returns the created [AddedAffectedEntityEvent],
     * or `null` if the [AffectedByIssue] was already on the [Issue].
     * Checks the authorization status, checks that the [AffectedByIssue] can be added to on the [Issue]
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [AffectedByIssue] to add to which [Issue]
     * @return the saved created [AddedAffectedEntityEvent] or `null` if no event was created
     */
    suspend fun addAffectedEntityToIssue(
        authorizationContext: GropiusAuthorizationContext, input: AddAffectedEntityToIssueInput
    ): AddedAffectedEntityEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val affectedEntity = affectedByIssueRepository.findById(input.affectedEntity)
        checkPermission(
            affectedEntity.relatedTrackable(),
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable related to the affectedEntity"
        )
        return if (affectedEntity !in issue.affects()) {
            return timelineItemRepository.save(
                addAffectedEntityToIssue(issue, affectedEntity, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Adds an [affectedEntity] to an [issue] at [atTime] as [byUser] and adds a [AddedAffectedEntityEvent]
     * to the timeline.
     * Creates the event even if the [affectedEntity] was already affected by the [issue].
     * Only adds the [affectedEntity] to the `affects` on the [issue] if no newer timeline item exists which removes
     * it again.
     * Does not check the authorization status.
     * Checks if the [affectedEntity] can be affected by the [issue].
     * Does neither save the created [AddedToPinnedIssuesEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [AddedAffectedEntityEvent] afterwards.
     *
     * @param issue the [Issue] which should affect [affectedEntity]
     * @param affectedEntity the [AffectedByIssue] which should be affected by the [issue]
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [AddedAffectedEntityEvent]
     * @throws IllegalArgumentException if [issue] cannot affect the [affectedEntity]
     */
    suspend fun addAffectedEntityToIssue(
        issue: Issue, affectedEntity: AffectedByIssue, atTime: OffsetDateTime, byUser: User
    ): AddedAffectedEntityEvent {
        val relatedTrackable = affectedEntity.relatedTrackable()
        if (relatedTrackable !in issue.trackables()) {
            throw IllegalArgumentException("The Issue is not on a Trackable related to the entity")
        }
        val event = AddedAffectedEntityEvent(atTime, atTime)
        event.addedAffectedEntity().value = affectedEntity
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<RemovedAffectedEntityEvent>(
                issue, atTime
            ) { it.removedAffectedEntity().value == affectedEntity }
        ) {
            issue.affects() += affectedEntity
        }
        return event
    }

    /**
     * Removes an [AffectedByIssue] from an [Issue], returns the created [RemovedAffectedEntityEvent],
     * or `null` if the [AffectedByIssue] was not affected by the [Issue].
     * Checks the authorization status
     *
     * @param authorizationContext used to check for the required permission
     * @param input defines which [AffectedByIssue] to remove from which [Issue]
     * @return the saved created [RemovedAffectedEntityEvent] or `null` if no event was created
     */
    suspend fun removeAffectedEntityFromIssue(
        authorizationContext: GropiusAuthorizationContext, input: RemoveAffectedEntityFromIssueInput
    ): RemovedAffectedEntityEvent? {
        input.validate()
        val issue = repository.findById(input.issue)
        val affectedEntity = affectedByIssueRepository.findById(input.affectedEntity)
        checkPermission(
            affectedEntity.relatedTrackable(),
            Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext),
            "manage Issues on the Trackable related to the affectedEntity"
        )
        return if (affectedEntity in issue.affects()) {
            return timelineItemRepository.save(
                removeAffectedEntityFromIssue(
                    issue, affectedEntity, OffsetDateTime.now(), getUser(authorizationContext)
                )
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Removes an [affectedEntity] from an [issue] at [atTime] as [byUser] and adds a [RemovedAffectedEntityEvent]
     * to the timeline.
     * Creates the event even if the [affectedEntity] was not affected by the [issue].
     * Only removes the [affectedEntity] from the `affects` on the [issue] if no newer timeline item exists which adds
     * it again.
     * Does not check the authorization status.
     * Does neither save the created [RemovedAffectedEntityEvent] nor the [issue].
     * It is necessary to save the [issue] or returned [RemovedAffectedEntityEvent] afterwards.
     *
     * @param issue the [Issue] which no longer should affect [affectedEntity]
     * @param affectedEntity the [AffectedByIssue] which should be removed from the affected entities on the [issue]
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     * @return the created [RemovedAffectedEntityEvent]
     */
    suspend fun removeAffectedEntityFromIssue(
        issue: Issue, affectedEntity: AffectedByIssue, atTime: OffsetDateTime, byUser: User
    ): RemovedAffectedEntityEvent {
        val event = RemovedAffectedEntityEvent(atTime, atTime)
        event.removedAffectedEntity().value = affectedEntity
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<AddedAffectedEntityEvent>(
                issue, atTime
            ) { it.addedAffectedEntity().value == affectedEntity }
        ) {
            issue.affects() -= affectedEntity
        }
        return event
    }

    /**
     * Checks that the user has [TrackablePermission.MANAGE_ISSUES] on [issue]
     *
     * @param issue the [Issue] where the permission must be granted
     * @param authorizationContext necessary for checking for the permission
     * @throws IllegalArgumentException if the permission is not granted
     */
    private suspend fun checkManageIssuesPermission(
        issue: Issue, authorizationContext: GropiusAuthorizationContext
    ) {
        checkPermission(issue, Permission(TrackablePermission.MANAGE_ISSUES, authorizationContext), "manage the Issue")
    }

    /**
     * Changes a property of [issue], return the created event or null if the property was not changed.
     * Checks the authorization status ([TrackablePermission.MANAGE_ISSUES] on the [issue])
     *
     * @param T the type of the property
     * @param E the type of the timeline item
     * @param authorizationContext used to check for the required permission
     * @param issue the  [Issue] to update
     * @param currentValue the current value of the property
     * @param newValue the new value of the property
     * @param internalFunction used to create the returned event and apply the change
     * @return the saved created event or `null` if no event was created
     */
    private suspend fun <T, E : TimelineItem> changeIssueProperty(
        authorizationContext: GropiusAuthorizationContext,
        issue: Issue,
        currentValue: T,
        newValue: T,
        internalFunction: suspend (issue: Issue, oldValue: T, newValue: T, atTime: OffsetDateTime, byUser: User) -> E,
    ): E? {
        checkManageIssuesPermission(issue, authorizationContext)
        return if (currentValue != newValue) {
            return timelineItemRepository.save(
                internalFunction(issue, currentValue, newValue, OffsetDateTime.now(), getUser(authorizationContext))
            ).awaitSingle()
        } else {
            null
        }
    }

    /**
     * Changes a property of an  [issue] at [atTime] as [byUser] and adds the [event] to the timeline.
     * Only changes the property if no newer timeline item exists which changes it.
     * Does not check the authorization status.
     * Does neither save the [event] nor the [issue].
     * Calls [createdTimelineItem] on the [event].
     *
     * @param T the type of the property
     * @param E the type of the timeline item
     * @param issue the [Issue] where the `spentTime` should be changed
     * @param newValue the new value of the property
     * @param atTime the point in time when the modification happened, updates [Issue.lastUpdatedAt] if necessary
     * @param property the property on the [issue]
     * @param event the already created [TimelineItem] for the change
     * @param byUser the [User] who caused the update, updates [Issue.participants] if necessary
     */
    private suspend inline fun <T, reified E : TimelineItem> changeIssueProperty(
        issue: Issue, newValue: T, atTime: OffsetDateTime, byUser: User, property: KMutableProperty0<T>, event: E
    ) {
        createdTimelineItem(issue, event, atTime, byUser)
        if (!existsNewerTimelineItem<E>(issue, atTime) && (property.get() != newValue)) {
            property.set(newValue)
            updateAuditedNode(issue, byUser, atTime)
        }
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
        issue: Issue, time: OffsetDateTime, itemFilter: (T) -> Boolean = { true }
    ): Boolean {
        return issue.timelineItems().any {
            (it is T) && (it.createdAt > time) && itemFilter(it)
        }
    }

}