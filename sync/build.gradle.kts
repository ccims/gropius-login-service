val graphglueVersion: String by project
val graphqlJavaVersion: String by project
val ktorVersion: String by project

plugins {
    kotlin("plugin.spring")
}

dependencies {
    api(project(path = ":core"))
    implementation("io.ktor", "ktor-client-core", ktorVersion)
    implementation("io.ktor", "ktor-client-okhttp", ktorVersion)
}