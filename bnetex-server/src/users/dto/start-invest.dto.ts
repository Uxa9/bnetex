import { IsNumber, Min } from "class-validator";

export class StartInvestDto {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @IsNumber({}, {
        message : "Id must be a number"
    })
    @Min(0, {
        message : "Value must be more than 0"
    })
    readonly amount : number;
}