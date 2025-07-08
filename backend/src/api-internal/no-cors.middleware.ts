import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "src/api-oauth/StateMiddleware";

@Injectable()
export class NoCorsMiddleware extends StateMiddleware {
    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        res.set("Access-Control-Allow-Origin", process.env.GROPIUS_ENDPOINT);
        next();
    }
}
