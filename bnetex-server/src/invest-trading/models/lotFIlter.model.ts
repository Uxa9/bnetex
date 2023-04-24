import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import { BinanceSymbols } from "./binanceSymbols.model";

interface LotFilterCreationAttrs {
    stepSize: string,
    maxQty: string,
    minQty: string
}

@Table({
    tableName : 'lotFilter'
})
export class LotFilter extends Model<LotFilter, LotFilterCreationAttrs> {

    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @Column({
        type : DataType.STRING,
    })
    stepSize: string;

    @Column({
        type : DataType.STRING,
    })
    maxQty: string;

    @Column({
        type : DataType.STRING,
    })
    minQty: string;

    @ForeignKey(() => BinanceSymbols)
    @Column({
        type : DataType.INTEGER
    })
    binanceSymbolsId: number;

    @BelongsTo(() => BinanceSymbols)
    binanceSymbols: BinanceSymbols;

}