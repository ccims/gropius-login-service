import org.jetbrains.dokka.gradle.DokkaTaskPartial

description = "A Cross-Component Issue Management System for Component-based Architectures"

plugins {
    kotlin("jvm")
    id("org.jetbrains.dokka")
}

allprojects {
    repositories {
        mavenCentral()
    }
}

subprojects {
    val dokkaGraphQLDescriptionPluginVersion: String by project

    apply(plugin = "kotlin")
    apply(plugin = "org.jetbrains.dokka")

    dependencies {
        dokkaPlugin("io.github.graphglue", "dokka-graphql-description-plugin", dokkaGraphQLDescriptionPluginVersion)
    }

    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets {
            configureEach {
                includeNonPublic.set(true)
            }
        }
    }
}