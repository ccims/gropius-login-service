package gropius

import io.github.graphglue.data.DefaultIndexCreator
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component

/**
 * Handles startup tasks like creating indices.
 *
 * @param defaultIndexCreator the [DefaultIndexCreator] to use
 */
@Component
class StartupHandler(val defaultIndexCreator: DefaultIndexCreator) {

    /**
     * Called after startup
     */
    @PostConstruct
    fun onStartup() {
        defaultIndexCreator.createDefaultIndices()
    }

}