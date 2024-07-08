import { NestMiddleware } from "@nestjs/common";
import { ensureState } from "src/strategies/utils";
import { Request, Response } from "express";

export abstract class StateMiddleware<S extends Record<string, any> = {}, T extends Record<string, any> = {}>
    implements NestMiddleware
{
    async use(req: Request, res: Response, next: (error?: Error | any) => any) {
        ensureState(res);
        if (res.locals.state.error) {
            this.useWithError(req, res, res.locals.state.error, next);
        } else {
            try {
                await this.useWithState(req, res, res.locals.state, next);
            } catch (error) {
                this.appendState(res, { error } as any);
                next();
            }
        }
    }

    protected abstract useWithState(
        req: Request,
        res: Response,
        state: S & { error?: any },
        next: (error?: Error | any) => void,
    ): Promise<any>;

    /**
     * Overwrite this to handle errors
     */
    protected useWithError(req: Request, res: Response, error: any, next: (error?: Error | any) => void) {
        next();
    }

    protected appendState(res: Response, appendedState: Partial<T> & { error?: any }) {
        res.locals.state = { ...res.locals.state, ...appendedState };
    }
}
