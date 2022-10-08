package gropius.schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import gropius.authorization.gropiusAuthorizationContext
import gropius.dto.input.common.DeleteNodeInput
import gropius.dto.input.issue.*
import gropius.graphql.AutoPayloadType
import gropius.model.architecture.Trackable
import gropius.model.issue.Artefact
import gropius.model.issue.Label
import gropius.model.issue.timeline.*
import gropius.service.issue.ArtefactService
import gropius.service.issue.IssueService
import gropius.service.issue.LabelService
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

/**
 * Contains all issue-related mutations
 *
 * @param issueService used for Issue-related mutations
 * @param labelService used for Label-related mutations
 * @param artefactService used for Artefact-related mutations
 */
@Component
@Transactional(propagation = Propagation.REQUIRES_NEW)
class IssueMutations(
    private val issueService: IssueService,
    private val labelService: LabelService,
    private val artefactService: ArtefactService
) : Mutation {

    @GraphQLDescription(
        """Creates a new Label on at least one Trackable. Requires MANAGE_LABELS on all provided Trackables.
        """
    )
    @AutoPayloadType("The created Label")
    suspend fun createLabel(
        @GraphQLDescription("Defines the created Label")
        input: CreateLabelInput, dfe: DataFetchingEnvironment
    ): Label {
        return labelService.createLabel(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription("Updates the specified Label, requires MANAGE_LABELS on any Trackable the Label is on")
    @AutoPayloadType("The updated Label")
    suspend fun updateLabel(
        @GraphQLDescription("Defines which Label to update and how to update it")
        input: UpdateLabelInput, dfe: DataFetchingEnvironment
    ): Label {
        return labelService.updateLabel(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Adds a Label to a Trackable, requires MANAGE_LABELS on the Trackable and EXPORT_LABEL on any Trackable
        the Label is on        
        """
    )
    @AutoPayloadType("The Trackable to which the Label was added")
    suspend fun addLabelToTrackable(
        @GraphQLDescription("Defines the Label and Trackable")
        input: AddLabelToTrackableInput, dfe: DataFetchingEnvironment
    ): Trackable {
        return labelService.addLabelToTrackable(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Removes a Label from a Trackable, requires MANAGE_LABELS on the Trackable.
        Removes the Label from all Issues where the Label cannot be anymore, as the Trackable of the Label and the Issue
        are now disjoint.
        """
    )
    @AutoPayloadType("The Trackable from which the Label was removed")
    suspend fun removeLabelFromTrackable(
        @GraphQLDescription("Defines the Label and Trackable")
        input: RemoveLabelFromTrackableInput, dfe: DataFetchingEnvironment
    ): Trackable {
        return labelService.removeLabelFromTrackable(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Deletes the Label, requires MANAGE_LABELS on all Trackables it is on.
        Removes it from all Issues. Note that the Label will still be visible in the timeline of Issues.
        """
    )
    @AutoPayloadType("The id of the deleted Label")
    suspend fun deleteLabel(
        @GraphQLDescription("Defines which Label to delete")
        input: DeleteNodeInput, dfe: DataFetchingEnvironment
    ): ID {
        labelService.deleteLabel(dfe.gropiusAuthorizationContext, input)
        return input.id
    }

    @GraphQLDescription("Creates a new Artefact on a Trackable. Requires MANAGE_ARTEFACTS on the provided Trackable.")
    @AutoPayloadType("The created Artefact")
    suspend fun createArtefact(
        @GraphQLDescription("Defines the created Artefact")
        input: CreateArtefactInput, dfe: DataFetchingEnvironment
    ): Artefact {
        return artefactService.createArtefact(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Updates the specified Artefact, requires MANAGE_ARTEFACTS on the Trackable the Artefact is part of
        """
    )
    @AutoPayloadType("The updated Artefact")
    suspend fun updateArtefact(
        @GraphQLDescription("Defines which Artefact to update and how to update it")
        input: UpdateArtefactInput, dfe: DataFetchingEnvironment
    ): Artefact {
        return artefactService.updateArtefact(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Deletes the Artefact, requires MANAGE_ARTEFACTS on the Trackable it is part of. Removes it from all Issues.
        """
    )
    @AutoPayloadType("The id of the deleted Artefact")
    suspend fun deleteArtefact(
        @GraphQLDescription("Defines which Artefact to delete")
        input: DeleteNodeInput, dfe: DataFetchingEnvironment
    ): ID {
        artefactService.deleteArtefact(dfe.gropiusAuthorizationContext, input)
        return input.id
    }

    @GraphQLDescription(
        """Adds a Label to an Issue, requires MANAGE_ISSUES on any Trackable the issue is on and READ on the Label.
        Additionally, the Label must be on at least on Trackable the Issue is on.
        If the Label is already on the Issue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun addLabelToIssue(
        @GraphQLDescription("Defines the Label and Issue")
        input: AddLabelToIssueInput, dfe: DataFetchingEnvironment
    ): AddedLabelEvent? {
        return issueService.addLabelToIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Removes a Label from an Issue, requires MANAGE_ISSUES on any Trackable the issue is on.
        If the Label is not on the Issue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun removeLabelFromIssue(
        @GraphQLDescription("Defines the Label and Issue")
        input: RemoveLabelFromIssueInput, dfe: DataFetchingEnvironment
    ): RemovedLabelEvent? {
        return issueService.removeLabelFromIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Adds a Artefact to an Issue, requires MANAGE_ISSUES on any Trackable the issue is on and READ on the Artefact.
        Additionally, the Artefact must be part of a Trackable the Issue is on.
        If the Artefact is already on the Issue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun addArtefactToIssue(
        @GraphQLDescription("Defines the Artefact and Issue")
        input: AddArtefactToIssueInput, dfe: DataFetchingEnvironment
    ): AddedArtefactEvent? {
        return issueService.addArtefactToIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Removes a Artefact from an Issue, requires MANAGE_ISSUES on any Trackable the issue is on.
        If the Artefact is not on the Issue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun removeArtefactFromIssue(
        @GraphQLDescription("Defines the Artefact and Issue")
        input: RemoveArtefactFromIssueInput, dfe: DataFetchingEnvironment
    ): RemovedArtefactEvent? {
        return issueService.removeArtefactFromIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Adds an Issue to a Trackable, requires MANAGE_ISSUES on the Trackable the Issue should be added to,
        and EXPORT_ISSUES on any Trackable the Issue currently is on.
        If the Issue is already on the Trackable, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun addIssueToTrackable(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: AddIssueToTrackableInput, dfe: DataFetchingEnvironment
    ): AddedToTrackableEvent? {
        return issueService.addIssueToTrackable(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Removes an Issue from a Trackable, requires MANAGE_ISSUES on the Trackable where the Issue should
        be removed from.
        If the Issue is not on the Trackable, no event is created.
        Also removes any Artefacts, Labels and AffectedByIssue which cannot be any more on the Issue, 
        and unpins the issue on the defined Trackable if it was pinned.
        The created events can be found in the childItems of the returned RemovedFromTrackableEvent.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun removeIssueFromTrackable(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: RemoveIssueFromTrackableInput, dfe: DataFetchingEnvironment
    ): RemovedFromTrackableEvent? {
        return issueService.removeIssueFromTrackable(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Pins an Issue on a Trackable, requires MANAGE_ISSUES on the Trackable the Issue should be pinned on.
        Additionally, the Issue must already be on the Trackable.
        If the Issue is already pinned on the Trackable, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun addIssueToPinnedIssues(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: AddIssueToPinnedIssuesInput, dfe: DataFetchingEnvironment
    ): AddedToPinnedIssuesEvent? {
        return issueService.addIssueToPinnedIssues(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Unpins the Issue on a Trackable, requires MANAGE_ISSUES on the Trackable where the Issue should
        be unpinned.
        If the Issue is not pinned on the Trackable, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun removeIssueFromPinnedIssues(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: RemoveIssueFromPinnedIssuesInput, dfe: DataFetchingEnvironment
    ): RemovedFromPinnedIssuesEvent? {
        return issueService.removeIssueFromPinnedIssues(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `dueDate` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        If the `dueDate` is equal to the already existing `dueDate`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueDueDate(
        @GraphQLDescription("Defines the Issue and new `dueDate`")
        input: ChangeIssueDueDateInput, dfe: DataFetchingEnvironment
    ): DueDateChangedEvent? {
        return issueService.changeIssueDueDate(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `estimatedTime` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        If the `estimatedTime` is equal to the already existing `estimatedTime`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueEstimatedTime(
        @GraphQLDescription("Defines the Issue and new `estimatedTime`")
        input: ChangeIssueEstimatedTimeInput, dfe: DataFetchingEnvironment
    ): EstimatedTimeChangedEvent? {
        return issueService.changeIssueEstimatedTime(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `priority` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        Additionally, the IssuePriority must be defined by the Template of the Issue.
        If the `priority` is equal to the already existing `priority`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssuePriority(
        @GraphQLDescription("Defines the Issue and new `priority`")
        input: ChangeIssuePriorityInput, dfe: DataFetchingEnvironment
    ): PriorityChangedEvent? {
        return issueService.changeIssuePriority(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `spentTime` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        If the `spentTime` is equal to the already existing `spentTime`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueSpentTime(
        @GraphQLDescription("Defines the Issue and new `spentTime`")
        input: ChangeIssueSpentTimeInput, dfe: DataFetchingEnvironment
    ): SpentTimeChangedEvent? {
        return issueService.changeIssueSpentTime(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `startDate` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        If the `startDate` is equal to the already existing `startDate`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueStartDate(
        @GraphQLDescription("Defines the Issue and new `startDate`")
        input: ChangeIssueStartDateInput, dfe: DataFetchingEnvironment
    ): StartDateChangedEvent? {
        return issueService.changeIssueStartDate(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `state` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        Additionally, the IssueState must be defined by the Template of the Issue.
        If the `state` is equal to the already existing `state`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueState(
        @GraphQLDescription("Defines the Issue and new `state`")
        input: ChangeIssueStateInput, dfe: DataFetchingEnvironment
    ): StateChangedEvent? {
        return issueService.changeIssueState(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `title` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        If the `title` is equal to the already existing `title`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueTitle(
        @GraphQLDescription("Defines the Issue and new `title`")
        input: ChangeIssueTitleInput, dfe: DataFetchingEnvironment
    ): TitleChangedEvent? {
        return issueService.changeIssueTitle(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the `type` of an Issue requires MANAGE_ISSUES on any of the Trackables the Issue is on.
        Additionally, the IssueType must be defined by the Template of the Issue.
        If the `type` is equal to the already existing `type`, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueType(
        @GraphQLDescription("Defines the Issue and new `type`")
        input: ChangeIssueTypeInput, dfe: DataFetchingEnvironment
    ): TypeChangedEvent? {
        return issueService.changeIssueType(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Adds an AffectedByIssue to an Issue, requires MANAGE_ISSUES on any of the Trackables the Issue is on,
        and AFFECT_ENTITIES_WITH_ISSUES on the Trackable associated with the AffectedByIssue.
        If the Issue already affects the AffectedByIssue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun addAffectedEntityToIssue(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: AddAffectedEntityToIssueInput, dfe: DataFetchingEnvironment
    ): AddedAffectedEntityEvent? {
        return issueService.addAffectedEntityToIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Removes an AffectedByIssue from an Issue, requires MANAGE_ISSUES on any of the Trackables the Issue is on,
        or AFFECT_ENTITIES_WITH_ISSUES on the Trackable associated with the AffectedByIssue.
        If the Issue does not affect the AffectedByIssue, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun removeAffectedEntityFromIssue(
        @GraphQLDescription("Defines the Issue and Trackable")
        input: RemoveAffectedEntityFromIssueInput, dfe: DataFetchingEnvironment
    ): RemovedAffectedEntityEvent? {
        return issueService.removeAffectedEntityFromIssue(dfe.gropiusAuthorizationContext, input)
    }

    @GraphQLDescription(
        """Changes the value of a templated field on an Issue, requires MANAGE_ISSUES on any of the Trackables 
        the Issue is on.
        Additionally, the field with the name must be defined by the template of the Issue, and the provided new value
        must be compatible.
        If the new value is equal to the current value of the templated field, no event is created.
        """
    )
    @AutoPayloadType("The created event, if present")
    suspend fun changeIssueTemplatedField(
        @GraphQLDescription("Defines the Issue, the templated field and its new value")
        input: ChangeIssueTemplatedFieldInput, dfe: DataFetchingEnvironment
    ): TemplatedFieldChangedEvent? {
        return issueService.changeIssueTemplatedField(dfe.gropiusAuthorizationContext, input)
    }

}