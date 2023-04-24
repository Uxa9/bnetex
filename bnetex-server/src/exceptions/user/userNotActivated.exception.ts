import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotActivated extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_NOT_ACTIVATED"
            },
            HttpStatus.FORBIDDEN
        );
    }
}