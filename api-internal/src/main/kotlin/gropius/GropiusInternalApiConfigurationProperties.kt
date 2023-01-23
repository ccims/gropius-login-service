package gropius

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Configuration properties for the internal API
 *
 * @param apiToken if provided, all requests to the graphql api must provide the token in the Authorization header
 */
@ConfigurationProperties("gropius.api.internal")
data class GropiusInternalApiConfigurationProperties( val apiToken: String? = null)