import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleNotFound extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "EXPECTED_ROLE_NOT_FOUND_CHECK_DB"
            },
            HttpStatus.EXPECTATION_FAILED
        );
    }
}