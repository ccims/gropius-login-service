package gropius

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

/**
 * Configuration properties for the GitHub API
 *
 * @param maxMutationCount maximum number of mutations during single sync cycle
 */
@ConstructorBinding
@ConfigurationProperties("gropius.sync.github")
data class GithubConfigurationProperties(val maxMutationCount: Int = 100)