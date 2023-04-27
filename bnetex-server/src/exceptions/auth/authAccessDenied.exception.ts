import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthAccessDenied extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "ACCESS_DENIED"
            },
            HttpStatus.FORBIDDEN
        );
    }
}