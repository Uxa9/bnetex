import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({
        example : 'investor',
        description : 'user role'
    })
    @MinLength(2, {
        message: "Name must be at least 2 characters"
    })
    @IsString({
        message : "Name must be a string"
    })
    readonly name: string;

    @ApiProperty({
        example : 'investor-huestor',
        description : 'user role description'
    })
    @IsOptional()
    @MinLength(2, {
        message: "Description must be at least 2 characters"
    })
    @IsString({
        message : "Description must be a string"
    })
    readonly desc: string;

    @ApiProperty({
        example : '50',
        description : 'role invest profit percentage'
    })
    @IsOptional()
    @Min(0, {
        message: "Invest percent must be positive"
    })
    @Max(100, {
        message: "Invest percent must be less than 100"
    })
    readonly investPercent: number;
}