import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {

    @ApiProperty({
        example : '1',
        description : 'user id'
    })
    readonly userId: number;

    @ApiProperty({
        example : '123.45',
        description : 'amount of money in transaction'
    })
    readonly amount: number;
}