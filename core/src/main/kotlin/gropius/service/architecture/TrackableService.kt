package gropius.service.architecture

import gropius.dto.input.architecture.UpdateTrackableInput
import gropius.dto.input.ifPresent
import gropius.model.architecture.Trackable
import gropius.repository.issue.ArtefactRepository
import gropius.repository.issue.LabelRepository
import gropius.service.issue.IssueService
import org.springframework.beans.factory.annotation.Autowired
import gropius.repository.GropiusRepository

/**
 * Base class for services for subclasses of [Trackable]
 *
 * @param repository the associated repository used for CRUD functionality
 */
abstract class TrackableService<T : Trackable, R : GropiusRepository<T, String>>(
    repository: R
) : AffectedByIssueService<T, R>(repository) {

    /**
     * Injected [IssueService]
     */
    @Autowired
    lateinit var issueService: IssueService

    /**
     * Injected [LabelRepository]
     */
    @Autowired
    lateinit var labelRepository: LabelRepository

    /**
     * Injected [ArtefactRepository]
     */
    @Autowired
    lateinit var artefactRepository: ArtefactRepository

    /**
     * Injected [IMSProjectService]
     */
    @Autowired
    lateinit var imsProjectService: IMSProjectService

    /**
     * Updates [node] based on [input]
     * Calls [updateNamedNode]
     * Updates repositoryURL
     *
     * @param node the node to update
     * @param input defines how to update the provided [node]
     */
    fun updateTrackable(node: Trackable, input: UpdateTrackableInput) {
        updateNamedNode(node, input)
        input.repositoryURL.ifPresent {
            node.repositoryURL = it
        }
    }

    /**
     * Must be called before [node] is deleted via the repository
     * Deletes all Artefacts
     * Deletes Labels and Issues, if only present on this Trackable
     *
     * @param node the [Trackable] which will be deleted
     */
    suspend fun beforeDeleteTrackable(node: Trackable) {
        artefactRepository.deleteAll(node.artefacts())
        val labelsToDelete = node.labels().filter {
            it.trackables().size == 1
        }
        labelRepository.deleteAll(labelsToDelete)
        node.issues().forEach {
            if (it.trackables().size == 1) {
                issueService.deleteIssue(it)
            }
        }
        node.syncsTo().forEach {
            imsProjectService.deleteIMSProject(it)
        }
    }

}