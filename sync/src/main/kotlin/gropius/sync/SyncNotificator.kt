package gropius.sync

import com.fasterxml.jackson.annotation.JsonProperty
import gropius.model.common.ExtensibleNode
import gropius.model.template.MutableTemplatedNode
import kotlinx.coroutines.reactor.awaitSingle
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.neo4j.core.ReactiveNeo4jOperations
import org.springframework.stereotype.Component

/**
 * Dummy class for the future notification center
 * @param helper Reference for the spring instance of JsonHelper
 * @param neoOperations Reference for the spring instance of ReactiveNeo4jOperations
 */
@Component
class SyncNotificator(
    @Qualifier("graphglueNeo4jOperations")
    private val neoOperations: ReactiveNeo4jOperations, private val helper: JsonHelper
) {
    /**
     * Logger used to print notifications
     */
    private val logger = LoggerFactory.getLogger(SyncNotificator::class.java)

    /**
     * Error that is allowed to be presented to the user and does not contain harmful information
     * @param code Translation file key
     * @param args Arguments to replace in the translation
     */
    class NotificatedError(val code: String, vararg args: String) : Exception(code) {
        val args = args.asList()
    }

    /**
     * Stub for a future notification
     * @param title Title to display
     * @param content Content to display
     */
    data class NotificationDummy(
        @JsonProperty("title")
        val title: String,
        @JsonProperty("content")
        val content: String
    ) {
        /**
         * Construct new NotificationDummy from an NotificatedError
         * @param error Error to construct the NotificationDummy from
         */
        constructor(error: NotificatedError) : this("Sync Error", error.code + ": " + error.args.joinToString(", "))
    }

    /**
     * Send notification
     * @param node Node of which the users should receive the notification from
     * @param dummy MotificationDummy containing the content
     */
    suspend fun sendNotification(node: ExtensibleNode, dummy: NotificationDummy) {
        logger.info("Send Notification: $dummy")
        if (node is MutableTemplatedNode) {
            node.templatedFields["last-notification"] = helper.objectMapper.writeValueAsString(dummy)
            neoOperations.save(node).awaitSingle()
        }
    }
}