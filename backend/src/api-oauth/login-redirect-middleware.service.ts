import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenScope } from "src/backend-services/token.service";
import { combineURL } from "../util/utils";

@Injectable()
export class LoginRedirectMiddleware implements NestMiddleware {
    async use(req: Request, res: Response) {
        const target = req.context.isRegisterAdditional() ? "register-additional" : "login";
        req.context.setStarted();
        res.redirect(combineURL(`auth/flow/${target}`, process.env.GROPIUS_ENDPOINT).toString());
    }
}
