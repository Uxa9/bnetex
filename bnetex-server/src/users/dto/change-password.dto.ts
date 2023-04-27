import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {

    @ApiProperty({
        example: "Lolkek228"
    })
    @IsString({
        message : "Previous password must be a string"
    })
    readonly prevPassword : string;

    @ApiProperty({
        example: "Lolkek228"
    })
    @IsString({
        message : "New password must be a string"
    })
    readonly newPassword : string;

}