import {Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import { PriceFilter } from "./priceFilter.model";
import { LotFilter } from "./lotFIlter.model";

interface BinanceSymbolsCreationAttrs {
    symbol : string,
    baseAsset : string,
    quoteAsset : string,
}

@Table({
    tableName : 'binanceSymbols'
})
export class BinanceSymbols extends Model<BinanceSymbols, BinanceSymbolsCreationAttrs> {

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
    symbol: string;

    @Column({
        type : DataType.STRING,
    })
    baseAsset: string;

    @Column({
        type : DataType.STRING,
    })
    quoteAsset: string;

    @HasOne(() => PriceFilter)
    priceFilter: PriceFilter;

    @HasOne(() => LotFilter)
    lotFilter: LotFilter;

}