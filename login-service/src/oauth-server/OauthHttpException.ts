import { HttpException, HttpStatus } from "@nestjs/common";

export class OauthHttpException extends HttpException {
    constructor(private readonly error_type: string, private readonly error_message: string) {
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
