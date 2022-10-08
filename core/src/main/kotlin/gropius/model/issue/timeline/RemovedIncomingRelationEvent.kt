package gropius.model.issue.timeline

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.user.permission.NodePermission
import io.github.graphglue.model.*
import org.springframework.data.annotation.Transient
import java.time.OffsetDateTime

@DomainNode
@GraphQLDescription(
    """Event representing that an incoming IssueRelation was removed.
    READ is granted if READ is granted on `removedRelation`.
    """
)
@Authorization(NodePermission.READ, allowFromRelated = ["removedRelation"])
class RemovedIncomingRelationEvent(
    createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
) : RemovedRelationEvent(createdAt, lastModifiedAt)