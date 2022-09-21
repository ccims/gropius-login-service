package gropius

import gropius.sync.github.SyncSelector
import io.github.graphglue.data.repositories.EnableGraphglueRepositories
import kotlinx.coroutines.runBlocking
import org.neo4j.driver.Driver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.boot.runApplication
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories
import org.springframework.data.neo4j.core.ReactiveDatabaseSelectionProvider
import org.springframework.data.neo4j.core.transaction.ReactiveNeo4jTransactionManager
import java.net.URI
import kotlin.system.exitProcess

/**
 * Configuration provider for the neo4j transaction manager
 * @param configurableApplicationContext Reference for the spring instance of ConfigurableApplicationContext
 */
@Configuration
class SyncConfiguration(
    val configurableApplicationContext: ConfigurableApplicationContext
) {
    /**
     * Necessary transaction manager
     *
     * @param driver used Neo4j driver
     * @param databaseNameProvider Neo4j database provider
     * @return the generated transaction manager
     */
    @Bean
    fun reactiveTransactionManager(
        driver: Driver, databaseNameProvider: ReactiveDatabaseSelectionProvider
    ): ReactiveNeo4jTransactionManager {
        return ReactiveNeo4jTransactionManager(driver, databaseNameProvider)
    }
}

/**
 * Configuration properties for the GitHub API
 *
 * @param loginServiceBase Base url for login service
 * @param apiSecret API Secret for login service
 */
@ConstructorBinding
@ConfigurationProperties("gropius.sync.github")
data class GropiusGithubConfigurationProperties(val loginServiceBase: URI, val apiSecret: String)

/**
 * Main Application
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableGraphglueRepositories
@EnableReactiveMongoRepositories
class Application : CommandLineRunner {
    /**
     * Reference for the spring instance of SyncSelector
     */
    @Autowired
    lateinit var syncSelector: SyncSelector

    override fun run(vararg args: String?) {
        try {
            runBlocking {
                syncSelector.sync()
            }
        } finally {
            exitProcess(0)//TODO: remove ASAP
        }
    }
}

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
