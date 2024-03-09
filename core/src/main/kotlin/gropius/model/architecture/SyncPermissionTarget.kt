package gropius.model.architecture

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import gropius.model.common.NamedNode
import gropius.model.user.GropiusUser
import io.github.graphglue.model.Direction
import io.github.graphglue.model.FilterProperty
import io.github.graphglue.model.NodeRelationship

@GraphQLDescription("A target where users can configure how the sync should behave.")
abstract class SyncPermissionTarget(name: String, description: String) : NamedNode(name, description) {

    @NodeRelationship(GropiusUser.CAN_SYNC_SELF, Direction.INCOMING)
    @GraphQLDescription("The users which allow to sync their data to this target.")
    @FilterProperty
    val syncSelfAllowedBy by NodeSetProperty<GropiusUser>()

    @NodeRelationship(GropiusUser.CAN_SYNC_OTHERS, Direction.INCOMING)
    @GraphQLDescription("The users which allow to sync the data of other users to this target.")
    @FilterProperty
    val syncOthersAllowedBy by NodeSetProperty<GropiusUser>()

}