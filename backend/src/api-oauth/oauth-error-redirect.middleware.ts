import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";
import { OAuthAuthorizeServerState } from "./OAuthAuthorizeServerState";

@Injectable()
export class OAuthErrorRedirectMiddleware extends StateMiddleware<OAuthAuthorizeServerState, {}> {
    private readonly logger = new Logger(OAuthErrorRedirectMiddleware.name);

    protected override async useWithState(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        next();
    }

    protected override useWithError(
        req: Request,
        res: Response,
        state: OAuthAuthorizeServerState & { error?: any },
        error: any,
        next: (error?: Error | any) => void,
    ): void {
        console.log(error);

        if (state.request?.redirect) {
            const url = new URL(state.request.redirect);
            if (error.error_type && error.error_message) {
                url.searchParams.append("error", error.error_type);
                url.searchParams.append(
                    "error_description",
                    error.error_message.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, ""),
                );
            } else {
                this.logger.error("Unknown error", error);
                url.searchParams.append("error", "server_error");
                url.searchParams.append("error_description", encodeURIComponent("An unknown error occurred"));
            }
            res.redirect(url.toString());
        } else {
            next();
        }
    }
}
