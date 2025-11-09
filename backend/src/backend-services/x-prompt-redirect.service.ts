import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { combineURL } from "../util/utils";
import { AuthClientService } from "../model/services/auth-client.service";
import { FlowState } from "../util/Context";

@Injectable()
export class PromptRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly authClientService: AuthClientService) {}

    async if(req: Request, res: Response) {
        const client = await this.authClientService.findAuthClient(req.context.flow.getRequest().clientId);
        return !(client.isInternal || req.context.flow.didConsent());
    }

    async use(req: Request, res: Response) {
        req.context.flow.setState(FlowState.PROMPT);
        return res.redirect(combineURL(`auth/flow/prompt`, process.env.GROPIUS_ENDPOINT).toString());
    }
}
