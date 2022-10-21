package gropius.dto.input

import com.expediagroup.graphql.generator.execution.OptionalInput
import kotlin.reflect.KProperty0

/**
 * Executes [block] with the value if `this is OptionalInput.Defined`
 *
 * @param block executed if input is defined
 */
inline fun <T> OptionalInput<T>.ifPresent(block: (T) -> Unit) {
    if (this is OptionalInput.Defined) {
        block(this.value!!)
    }
}

/**
 * `true` if the input is present
 */
val OptionalInput<*>.isPresent: Boolean get() = this is OptionalInput.Defined

/**
 * If present, returns its value, otherwise [value]
 *
 * @param value result in case not present
 * @return its value if present, otherwise [value]
 */
fun <T> OptionalInput<T>.orElse(value: T): T {
    ifPresent {
        return it
    }
    return value
}

/**
 * Helper function to ensure that two optional lists are disjoint
 * Typically used in an add/remove update context
 * Uses the properties to get the name of the properties to generate the failure message
 *
 * @param otherProperty the other property
 * @throws IllegalArgumentException if both lists are present and not disjoint
 */
infix fun KProperty0<OptionalInput<List<*>>>.ensureDisjoint(otherProperty: KProperty0<OptionalInput<List<*>>>) {
    this.get().ifPresent { thisIds ->
        otherProperty.get().ifPresent {
            val commonIds = thisIds intersect it.toSet()
            if (commonIds.isNotEmpty()) {
                throw IllegalArgumentException("`${this.name}` and `${otherProperty.name}` must be disjoint: $commonIds")
            }
        }
    }
}