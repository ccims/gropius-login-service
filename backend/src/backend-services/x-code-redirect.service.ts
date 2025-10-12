import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "src/backend-services/token.service";

@Injectable()
export class CodeRedirectService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly tokenService: TokenService) {}

    async use(req: Request, res: Response) {
        const request = req.context.flow.getRequest();

        const token = await this.tokenService.signAuthorizationCode(
            req.context.flow.getActiveLoginId(),
            request.clientId,
            request.scope,
            request.codeChallenge,
        );

        const url = new URL(request.redirect);
        url.searchParams.append("code", token);
        url.searchParams.append("state", request.state ?? "");

        // Update flow
        req.context.flow.drop();

        res.redirect(url.toString());
    }
}
