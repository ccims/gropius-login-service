import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthHttpException } from "../api-oauth/OAuthHttpException";
import * as Joi from "joi";

const schema = Joi.object({
    flow: Joi.string(),
    consent: Joi.bool(),
});

type Data = {
    flow: string;
    consent: boolean;
};

@Injectable()
export class PromptCallbackMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // Ensure that user is authenticated
        // TODO: this
        if (!req.context.auth.isAuthenticated() && !req.context.flow.tryActiveLoginId()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }

        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        // Update flow and ensure state
        if (data.consent) req.context.flow.setGranted();

        // Abort without consent
        if (!data.consent) {
            throw new OAuthHttpException("access_denied", "The user did not grant permission.");
        }

        next();
    }
}
