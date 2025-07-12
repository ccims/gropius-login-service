import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";
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
export class AuthPromptCallbackMiddleware extends StateMiddleware {
    constructor() {
        super();
    }

    protected override async useWithState(
        req: Request,
        res: Response,
        state: object,
        next: (error?: Error | any) => void,
    ): Promise<void> {
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
