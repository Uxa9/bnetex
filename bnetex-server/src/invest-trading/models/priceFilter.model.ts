import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import { BinanceSymbols } from "./binanceSymbols.model";

interface PriceFilterCreationAttrs {
    maxPrice: string,
    minPrice: string,
    tickSize: string
}

@Table({
    tableName : 'priceFilter'
})
export class PriceFilter extends Model<PriceFilter, PriceFilterCreationAttrs> {

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
    maxPrice: string;

    @Column({
        type : DataType.STRING,
    })
    minPrice: string;

    @Column({
        type : DataType.STRING,
    })
    tickSize: string;

    @ForeignKey(() => BinanceSymbols)
    @Column({
        type : DataType.INTEGER
    })
    binanceSymbolsId: number;

    @BelongsTo(() => BinanceSymbols)
    binanceSymbols: BinanceSymbols;

}