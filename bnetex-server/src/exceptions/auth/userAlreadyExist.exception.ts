import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExist extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_WITH_THIS_EMAIL_ALREADY_EXISTS"
            },
            HttpStatus.BAD_REQUEST
        );
    }
}