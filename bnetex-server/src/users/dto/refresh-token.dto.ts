import { IsNumber } from "class-validator";
import { Column, DataType, Default } from "sequelize-typescript";

export class RefreshToken {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    refreshToken : string;
}