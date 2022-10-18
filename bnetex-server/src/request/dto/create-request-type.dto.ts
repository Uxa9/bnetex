import { IsString } from "class-validator";

export class CreateRequestTypeDto {

    @IsString({
        message: 'request type name must be a string'
    })
    readonly type: string;
}