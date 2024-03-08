package gropius.repository.user

import gropius.model.user.GropiusUser
import gropius.repository.GropiusRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository

/**
 * Repository for [GropiusUser]
 */
@Repository
interface GropiusUserRepository : GropiusRepository<GropiusUser, String> {

    /**
     * Checks if a [GropiusUser] exists by username
     *
     * @param username the username to check for
     * @return `true` if a [GropiusUser] with the specified [username] exists
     */
    suspend fun existsByUsername(username: String): Boolean

    /**
     * Finds a [GropiusUser] by username
     *
     * @param username the username of the user to get
     * @return the found user
     */
    suspend fun findByUsername(username: String): GropiusUser?

    @Query("MATCH (n:`GropiusUser`:`User`:`BaseNode`:`Node`) RETURN n.id")
    suspend fun findAllIds(): List<String>
}