import { HttpException, HttpStatus } from "@nestjs/common";

export class UserException extends HttpException {
    constructor(error) {
        super(
            {
                status: "ERROR",
                message: `USER_${error.message}`
            },
            error.code
        );
    }
}