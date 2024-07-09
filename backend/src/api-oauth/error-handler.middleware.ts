import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { StateMiddleware } from "./StateMiddleware";

@Injectable()
export class ErrorHandlerMiddleware extends StateMiddleware<{}, {}> {
    protected override async useWithState(
        req: Request,
        res: Response,
        state: { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any> {
        next();
    }

    protected override useWithError(
        req: Request,
        res: Response,
        state: { error?: any },
        error: any,
        next: (error?: Error | any) => void,
    ): void {
        next(error);
    }
}
