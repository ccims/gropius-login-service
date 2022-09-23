/*
 * Copyright 2022 Expedia, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This is a modified version, for license see LICENSES
 */

package gropius.graphql

import com.expediagroup.graphql.generator.annotations.GraphQLType
import com.expediagroup.graphql.generator.exceptions.MultipleConstructorsFound
import com.expediagroup.graphql.generator.exceptions.PrimaryConstructorNotFound
import com.expediagroup.graphql.generator.execution.OptionalInput
import io.github.graphglue.graphql.extensions.getGraphQLName
import kotlin.reflect.*
import kotlin.reflect.full.*
import kotlin.reflect.jvm.jvmErasure

/**
 * Convert the argument from the argument map to a class we can pass to the Kotlin function.
 *
 * @param param the Kotlin parameter
 * @param argumentMap the map of graphql parameter name to graphql argument
 * @return the parsed parameter
 */
internal fun convertArgumentValueFromParam(
    param: KParameter, argumentMap: Map<String, Any?>
): Any? {
    return convertArgumentValue(param.getGraphQLName() ?: param.name!!, param.type, param, argumentMap)
}

/**
 * Convert the argument from the argument map to a class we can pass to the Kotlin function.
 *
 * @param param the Kotlin property
 * @param argumentMap the map of graphql parameter name to graphql argument
 * @return the parsed parameter
 */
internal fun convertArgumentValueFromProperty(
    param: KProperty1<*, *>, argumentMap: Map<String, Any?>
): Any? {
    return convertArgumentValue(param.getGraphQLName() ?: param.name, param.returnType, param, argumentMap)
}

/**
 * Convert the argument from the argument map to a class we can pass to the Kotlin function.
 *
 * @param argumentName the name of the graphql argument
 * @param type the type of the kotlin property/parameter
 * @param param the Kotlin parameter/property
 * @param argumentMap the map of graphql parameter name to graphql argument
 * @return the parsed parameter
 */
internal fun convertArgumentValue(
    argumentName: String, type: KType, param: KAnnotatedElement, argumentMap: Map<String, Any?>
): Any? {
    val argumentValue = argumentMap[argumentName]
    return when {
        type.isOptionalInputType -> {
            val paramType = type.arguments.first().type!!
            when {
                !argumentMap.containsKey(argumentName) -> OptionalInput.Undefined
                argumentValue == null -> {
                    if (!paramType.isMarkedNullable) {
                        throw IllegalArgumentException("Null not allowed, please do not provide at all (undefined)")
                    }
                    OptionalInput.Defined(null)
                }
                else -> {
                    val value = convertValue(paramType, argumentValue)
                    OptionalInput.Defined(value)
                }
            }
        }
        param.findAnnotation<GraphQLType>()?.typeName == "JSON" -> {
            argumentMap[argumentName]
        }
        else -> convertValue(type, argumentValue)
    }
}

/**
 * The value may already be parsed, so we can perform some checks to avoid duplicate deserialization
 */
private fun convertValue(
    paramType: KType, argumentValue: Any?
): Any? {
    // The input given is a list, iterate over each value to return a parsed list
    if (argumentValue is Iterable<*>) {
        return argumentValue.map {
            val wrappedType = paramType.arguments.first().type!!
            convertValue(wrappedType, it)
        }
    }

    // If the value is a generic map, parse each entry which may have some values already parsed
    if (argumentValue is Map<*, *>) {
        @Suppress("UNCHECKED_CAST") return mapToKotlinObject(argumentValue as Map<String, *>, paramType.jvmErasure)
    }

    // If the value is enum we need to find the correct value
    if (argumentValue is String && paramType.isSubtypeOf(Enum::class.starProjectedType)) {
        return mapToEnumValue(paramType, argumentValue)
    }

    // If param type is inline value class we need to wrap the value
    if (argumentValue != null && paramType.jvmErasure.isValue) {
        return mapToInlineValueClass(argumentValue, paramType.jvmErasure)
    }

    // Value is already parsed so we can return it as-is
    return argumentValue
}

/**
 * At this point all custom scalars have been converted by graphql-java so the only thing left to parse is object maps into the nested Kotlin classes
 *
 * Also handles `lateinit` property initialization
 */
private fun <T : Any> mapToKotlinObject(input: Map<String, *>, targetClass: KClass<T>): T {

    val targetConstructor = targetClass.primaryConstructor ?: run {
        if (targetClass.constructors.size == 1) {
            targetClass.constructors.first()
        } else if (targetClass.constructors.size > 1) {
            throw MultipleConstructorsFound(targetClass)
        } else {
            throw PrimaryConstructorNotFound(targetClass)
        }
    }

    // filter parameters that are actually in the input in order to rely on parameters default values
    // in target constructor
    val constructorParameters = targetConstructor.parameters.filter { parameter ->
        input.containsKey(parameter.getGraphQLName() ?: parameter.name) ||
                parameter.type.isOptionalInputType ||
                parameter.let { it.type.isMarkedNullable &&  !it.isOptional }
    }
    val constructorArguments = constructorParameters.associateWith { parameter ->
        convertArgumentValueFromParam(parameter, input)
    }
    val parsedObject = targetConstructor.callBy(constructorArguments)
    targetClass.memberProperties.forEach {
        if (it is KMutableProperty<*>) {
            it.setter.call(parsedObject, convertArgumentValueFromProperty(it, input))
        }
    }
    return parsedObject
}

/**
 * Map a value to an enum entry
 *
 * @param paramType the enum type
 * @param enumValue the name of the enum entry
 * @return the entry
 */
private fun mapToEnumValue(paramType: KType, enumValue: String): Enum<*> = paramType.jvmErasure
    .java
    .enumConstants
    .filterIsInstance(Enum::class.java)
    .map { enum ->
        val enumValueField = paramType.jvmErasure.java.getField(enum.name)
        enumValueField.name to enum
    }
    .first { (name, _) -> name == enumValue }
    .second

/**
 * Maps a value to an instance of an inline value class
 * If already is an instance of the class, this is a NO-OP
 *
 * @param value the value to map
 * @param targetClass the class to create an instance of
 * @return the wrapped [value]
 */
private fun <T : Any> mapToInlineValueClass(value: Any?, targetClass: KClass<T>): T {
    val targetConstructor = targetClass.primaryConstructor ?: throw PrimaryConstructorNotFound(targetClass)
    // if the user has registered a coercer for the value class, it may already be an instance of the target type
    @Suppress("UNCHECKED_CAST") return if (targetClass.isInstance(value)) value as T else targetConstructor.call(value)
}

/**
 * Property to check if a type is an [OptionalInput] type
 */
private val KType.isOptionalInputType get() = isSubtypeOf(OptionalInput::class.starProjectedType)