import { IsNumber } from "class-validator";

export class GetDataDto {

    @IsNumber({}, {
        message: 'from name must be a number'
    })
    readonly from: number;

    @IsNumber({}, {
        message: 'to name must be a number'
    })
    readonly to: number;

    // @IsNumber({}, {
    //     message: 'period name must be a number'
    // })
    // readonly period: number;

    @IsNumber({}, {
        message: 'period name must be a number'
    })
    readonly amount: number;
}