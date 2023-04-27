import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddRoleDto {
    @ApiProperty({
        example: "investor",
        description: "investor-huestor"
    })
    @IsString({
        message : "Value must be a string"
    })
    readonly value : string;

    @ApiProperty({
        example: "1",
        description: ""
    })
    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;
}