import { HttpException, HttpStatus } from "@nestjs/common";

export class OAuthHttpException extends HttpException {
    constructor(readonly error_type: string, readonly error_message: string) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                error: error_type,
                error_description: error_message,
                message: error_message,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
