import { NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

// TODO: remove this
export abstract class StateMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: (error?: Error | any) => any) {
        try {
            await this.useWithState(req, res, next);
        } catch (error) {
            next();
        }
    }

    protected abstract useWithState(req: Request, res: Response, next: (error?: Error | any) => void): Promise<any>;

    /**
     * Overwrite this to handle errors
     */
    protected useWithError(req: Request, res: Response, error: any, next: (error?: Error | any) => void) {
        next();
    }
}
