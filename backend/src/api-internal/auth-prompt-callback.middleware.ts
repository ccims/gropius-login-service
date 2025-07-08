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
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<void> {
        if (!req.flow.isAuthenticated()) {
            throw new OAuthHttpException("access_denied", "The user is not authenticated");
        }
        const data: Data = await schema.validateAsync(req.body);

        req.flow.setPrompted(data.flow);

        if (!data.consent) {
            // TODO: the user is not redirected to the client?
            throw new OAuthHttpException("access_denied", "The user did not grant permission.");
        }

        next();
    }
}
