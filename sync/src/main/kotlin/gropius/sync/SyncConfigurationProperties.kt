package gropius.sync

import org.springframework.boot.context.properties.ConfigurationProperties
import java.net.URI

/**
 * Configuration properties for the GitHub API
 *
 * @param loginServiceBase Base url for login service
 * @param apiSecret API Secret for login service
 */
@ConfigurationProperties("gropius.sync")
data class SyncConfigurationProperties(val loginServiceBase: URI, val apiSecret: String)