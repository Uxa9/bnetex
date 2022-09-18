import { IsNumber, IsString } from "class-validator";

export class AddRoleDto {
    @IsString({
        message : "Value must be a string"
    })
    readonly value : string;
    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;
}