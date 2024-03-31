package gropius.sync

import org.springframework.boot.context.properties.ConfigurationProperties
import java.net.URI

/**
 * Configuration properties for the GitHub API
 *
 * @param loginServiceBase Base url for login service
 * @param apiSecret API Secret for login service
 * @param schedulerFallbackTime Time in milliseconds to wait before the next sync
 */
@ConfigurationProperties("gropius.sync")
data class SyncConfigurationProperties(
    val schedulerFallbackTime: Long = 600_000,
    val loginServiceBase: URI,
    val apiSecret: String
)