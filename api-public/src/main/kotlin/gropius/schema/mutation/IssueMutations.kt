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
import gropius.model.issue.timeline.AddedArtefactEvent
import gropius.model.issue.timeline.AddedLabelEvent
import gropius.model.issue.timeline.RemovedArtefactEvent
import gropius.model.issue.timeline.RemovedLabelEvent
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

    @GraphQLDescription("Updates the specified Label, requires MANAGE_LABEL on any Trackable the Label is on")
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
        are now distinct.
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
        """Updates the specified Artefact, requires MANAGE_ARTEFACT on the Trackable the Artefact is part of
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
        """Adds a Label to an Issue, requires MANAGE_ISSUE on any Trackable the issue is on and READ on the Label.
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
        """Removes a Label from an Issue, requires MANAGE_ISSUe on any Trackable the issue is on.
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
        """Adds a Artefact to an Issue, requires MANAGE_ISSUE on any Trackable the issue is on and READ on the Artefact.
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
        """Removes a Artefact from an Issue, requires MANAGE_ISSUe on any Trackable the issue is on.
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

}