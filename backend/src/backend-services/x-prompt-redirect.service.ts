import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";
import { AuthClientService } from "../model/services/auth-client.service";
import { FlowState } from "../util/Context";

@Injectable()
export class PromptRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly authClientService: AuthClientService) {}

    /**
     * Check if we need to prompt the user for consent
     */
    async if(req: Request, res: Response) {
        const client = await this.authClientService.findAuthClient(req.context.flow.getRequest().clientId);

        // Do not prompt for internal clients
        if (client.isInternal) return false;

        // Do not prompt if already prompted
        if (req.context.flow.didConsent()) return false;

        // Otherwise, prompt
        return true;
    }

    /**
     * Redirect user to prompt page
     */
    async use(req: Request, res: Response) {
        req.context.flow.setState(FlowState.PROMPT);
        return res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}
