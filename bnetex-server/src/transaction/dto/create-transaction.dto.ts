import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateTransactionDto {

    @ApiProperty({
        example : '1',
        description : 'user id'
    })
    @IsNumber({}, {
        message: 'user id must be a number'
    })
    readonly userId: number;

    @ApiProperty({
        example : '123.45',
        description : 'amount of money in transaction'
    })
    @IsNumber({}, {
        message: 'amount of money must be a number'
    })
    readonly amount: number;
}