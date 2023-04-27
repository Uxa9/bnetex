import { IsNumber, Min } from "class-validator";

export class StartInvestDto {

    
    @Min(0, {
        message : "Value must be more than 0"
    })
    readonly amount : number;
}