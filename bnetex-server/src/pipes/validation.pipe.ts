import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        console.log(value);console.log(metadata.metatype);
        
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            let messages = "";

            errors.map(err => {                
                messages = messages.concat(`\n${Object.values(err.constraints).join(', ')}`);
            });

            throw new ValidationException({
                status: 'ERROR',
                message: messages
            });
        }

        return value;
    }

}