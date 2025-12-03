import { ArgumentsHost, ExceptionFilter, Logger } from "@nestjs/common";
import { OAuthHttpException } from "./OAuthHttpException";
import { Request, Response } from "express";

export abstract class RedirectOnErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(this.constructor.name);

    catch(error: OAuthHttpException, host: ArgumentsHost) {
        if (error instanceof Error) {
            this.logger.error(error.stack);
        } else {
            this.logger.error(error);
        }

        const context = host.switchToHttp();
        const req: Request = context.getRequest<Request>();
        const res: Response = context.getResponse<Response>();

        try {
            this.use(error, req, res);
        } catch (other) {
            if (other instanceof Error) {
                this.logger.error(other.stack);
            } else {
                this.logger.error(other);
            }

            return res.status(500).json({ error: "Internal server error" });
        }
    }

    abstract use(error: unknown, req: Request, res: Response): void;
}
