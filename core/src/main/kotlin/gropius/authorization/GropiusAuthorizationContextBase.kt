package gropius.authorization

import io.github.graphglue.authorization.AuthorizationContext
import org.neo4j.cypherdsl.core.Node

/**
 * Base gropius authorization context
 * Provides flexibility how to define the [userNode]
 *
 * @param userNode should be used in authorization check expressions
 * @param checkPermission if `false`, no authorization checks should be performed
 */
open class GropiusAuthorizationContextBase(
    val userNode: Node,
    val checkPermission: Boolean
) : AuthorizationContext