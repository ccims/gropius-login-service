package gropius.dto.input.common

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLType

@GraphQLDescription("Input set update the value of a JSON field, like an extension field or a templated field.")
open class JSONFieldInput(
    @GraphQLDescription("The name of the field")
    val name: String,
    @GraphQLDescription("The new value of the field")
    @GraphQLType("JSON")
    val value: Any?
) : Input()

/**
 * Ensures that a List of [JSONFieldInput] does not contain duplicate names and validates each entry
 *
 * @throws IllegalArgumentException if there are duplicate names
 */
fun List<JSONFieldInput>.validateAndEnsureNoDuplicates() {
    this.forEach { it.validate() }
    val duplicates = this.groupingBy { it.name }.eachCount().filter { it.value > 1 }.keys
    if (duplicates.isNotEmpty()) {
        throw IllegalArgumentException("Duplicate names found: $duplicates")
    }
}