import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotAuthorized extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_NOT_AUTHORIZED"
            },
            HttpStatus.UNAUTHORIZED
        );
    }
}