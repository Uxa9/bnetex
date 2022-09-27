import {  IsString } from "class-validator";

export class CreateTransactionStatusDto {

    @IsString({
        message: 'transaction status name must be a string'
    })
    readonly name: string;
}