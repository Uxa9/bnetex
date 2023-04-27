import { IsNumber, IsString, Min } from "class-validator";

export class CreateTradeSessionDto {

    
    @Min(0, {
        message : "Value must be more than 0"
    })
    readonly amount : number;

}