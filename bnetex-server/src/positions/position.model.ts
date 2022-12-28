import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { PositionEnters } from "./positionEnters.model";

interface PositionCreationAttrs {

}

@Table({
    tableName : 'POSITIONS'
})
export class Position extends Model<Position, PositionCreationAttrs> {

    @Column({
        type : DataType.DOUBLE
    })
    deposit : number;

    @Column({
        type : DataType.DOUBLE
    })
    enterPrice : number;

    @Column({
        type : DataType.DOUBLE
    })
    averagePrice : number;

    @Column({
        type : DataType.DATE,
        defaultValue : DataType.NOW,
    })
    enterTime : number;

    @Column({
        type : DataType.STRING
    })
    positionType : string;

    @Column({
        type : DataType.DOUBLE
    })
    status : number;

    @Column({
        type : DataType.STRING
    })
    pair : number;

    @Column({
        type : DataType.DOUBLE
    })
    volumeACTIVE : number;

    @Column({
        type : DataType.DOUBLE
    })
    volumeUSDT : number;

    @Column({
        type : DataType.INTEGER
    })
    enterStep : number;

    @Column({
        type : DataType.DOUBLE
    })
    closePrice : number;

    @Column({
        type : DataType.DATE,
    })
    closeTime : number;

    @Column({
        type : DataType.DOUBLE
    })
    percentProfit : number;

    @Column({
        type : DataType.DOUBLE
    })
    sumProfit : number;

    @Column({
        type : DataType.DOUBLE
    })
    lastEnterPrice : number;

    @Column({
        type : DataType.DOUBLE
    })
    minPrice : number;

    @HasMany(() => PositionEnters)
    positionEnters: PositionEnters[]

}