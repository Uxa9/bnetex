import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleDoubleFound extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "ROLE_ALREADY_EXISTS"
            },
            HttpStatus.FOUND
        );
    }
}