package gropius.sync.github.config

import gropius.model.architecture.IMSProject
import gropius.sync.JsonHelper
import gropius.sync.github.model.RepoDescription

/**
 * Config read out from a single IMSProject and an IMSConfig node
 * @param imsProject the Gropius IMSProject to use as input
 * @param imsConfig the config of the parent IMS
 * @param botUser bot user name
 * @param readUser read user name
 * @param repo repository url
 */
data class IMSProjectConfig(
    val imsProject: IMSProject,
    val imsConfig: IMSConfig,
    val botUser: String,
    val readUser: String,
    val repo: RepoDescription
) {
    /**
     * @param imsProject the Gropius IMSProject to use as input
     * @param helper Reference for the spring instance of JsonHelper
     * @param imsConfig the config of the parent IMS
     */
    constructor(
        helper: JsonHelper, imsConfig: IMSConfig, imsProject: IMSProject
    ) : this(
        imsProject,
        imsConfig,
        helper.parseString(imsProject.templatedFields["bot-user"]) ?: imsConfig.botUser,
        imsConfig.readUser,
        helper.objectMapper.readValue<RepoDescription>(
            imsProject.templatedFields["repo"]!!, RepoDescription::class.java
        )
    )

    val url get() = imsConfig.graphQLUrl
}
