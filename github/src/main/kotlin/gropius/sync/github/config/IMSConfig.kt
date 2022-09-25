package gropius.sync.github.config

import gropius.model.architecture.IMS
import gropius.model.template.IMSTemplate
import gropius.sync.JsonHelper
import java.net.URI

/**
 * Config read out from a single IMS node
 * @param ims the Gropius ims to use as input
 * @param botUser the bot user string extracted from the template
 * @param readUser the read user string extracted from the template
 * @param graphQLUrl the read url extracted from the template
 * @param imsTemplate the template of the current IMS
 */
data class IMSConfig(
    val ims: IMS, val botUser: String, val readUser: String, val graphQLUrl: URI, val imsTemplate: IMSTemplate
) {
    /**
     * @param ims the Gropius ims to use as input
     * @param helper Reference for the spring instance of JsonHelper
     * @param imsTemplate the template of the current IMS
     */
    constructor(
        helper: JsonHelper, ims: IMS, imsTemplate: IMSTemplate
    ) : this(
        ims,
        helper.parseString(ims.templatedFields["bot-user"]) ?: "github-bot",
        helper.parseString(ims.templatedFields["read-user"])!!,
        URI(helper.parseString(ims.templatedFields["graphql-url"])!!),
        imsTemplate
    )
}
