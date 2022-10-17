import { IsNumber } from "class-validator";

export class UserIdDto {
    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;
}