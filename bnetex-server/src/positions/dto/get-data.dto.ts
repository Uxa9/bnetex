import { IsNumber } from "class-validator";

export class GetDataDto {

    @IsNumber({}, {
        message: 'period name must be a number'
    })
    readonly period: number;

    @IsNumber({}, {
        message: 'period name must be a number'
    })
    readonly amount: number;
}