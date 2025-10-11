import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import * as Joi from "joi";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";

const schema = Joi.object({
    flow: Joi.string(),
    consent: Joi.bool(),
    csrf: Joi.string().allow("").optional(),
});

type Data = {
    flow: string;
    consent: boolean;
};

@Injectable()
export class PromptCallbackService {
    private readonly logger = new Logger(this.constructor.name);

    async use(req: Request, res: Response) {
        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        // Consent required
        if (!data.consent) throw new OAuthHttpException("access_denied", "The user did not grant permission.");

        // Update flow and ensure state
        req.context.flow.setGranted();
    }
}
