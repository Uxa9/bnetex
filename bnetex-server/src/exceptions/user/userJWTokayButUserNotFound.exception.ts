import { HttpException, HttpStatus } from "@nestjs/common";

export class UserJWTOkayButUserNotFound extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "JWT_OKAY_BUT_USER_NOT_FOUND"
            },
            HttpStatus.EXPECTATION_FAILED
        );
    }
}