import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OAuthHttpException } from "../../api-oauth/OAuthHttpException";
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
export class AuthPromptCallbackMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        // Ensure that user is authenticated
        if (!req.flow.isAuthenticated()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }

        // Validate input data
        const data: Data = await schema.validateAsync(req.body);

        // Update flow and ensure state
        req.flow.setPrompted(data.consent, data.flow);

        // Abort without consent
        if (!data.consent) {
            // TODO: the user is not redirected to the client?
            throw new OAuthHttpException("access_denied", "The user did not grant permission.");
        }

        // Update flow
        req.flow.setFinished(data.flow);

        next();
    }
}
