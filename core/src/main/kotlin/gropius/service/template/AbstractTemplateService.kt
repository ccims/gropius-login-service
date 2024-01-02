package gropius.service.template

import com.expediagroup.graphql.generator.scalars.ID
import gropius.dto.input.orElse
import gropius.dto.input.template.CreateTemplateInput
import gropius.model.template.Template
import gropius.repository.GropiusRepository
import gropius.repository.findAllById

/**
 * Base class for services for subclasses of [Template]
 *
 * @param repository the associated repository used for CRUD functionality
 * @param T the type of Node this service is used for
 * @param R Repository type associated with [T]
 */
abstract class AbstractTemplateService<T : Template<*, T>, R : GropiusRepository<T, String>>(
    repository: R
) : BaseTemplateService<T, R>(repository) {

    /**
     * Updates [template] based on [input]
     * Sets extends and templateFieldSpecifications
     *
     * @param template the [Template] to update
     * @param input specifies templateFieldSpecifications, extended templates
     */
    suspend fun createdTemplate(template: T, input: CreateTemplateInput) {
        val extendedTemplates = repository.findAllById(input.extends.orElse(emptyList()))
        template.extends().addAll(extendedTemplates)
        createdBaseTemplate(template, input, extendedTemplates)
    }

}

/**
 * Returns all templates which extend the template with the provided [ids]
 * Includes the template with the provided [ids], and indirect extending templates.
 *
 * @param ids the ids of the templates to get the extending templates for
 * @return the extending templates
 */
suspend fun <T : Template<*, out T>, R : GropiusRepository<T, String>> BaseTemplateService<T, R>.findAllByIdWithExtending(
    ids: Collection<ID>
): Set<T> {
    val toCheck = repository.findAllById(ids).toMutableList()
    val found = toCheck.toMutableSet()
    while (toCheck.isNotEmpty()) {
        val current = toCheck.removeLast()
        current.extends().forEach {
            if (found.add(it)) {
                toCheck.add(it)
            }
        }
    }
    return found
}