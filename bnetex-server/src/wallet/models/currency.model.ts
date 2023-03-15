import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Wallet} from "./wallet.model";


interface CurrencyCreationAttrs {
    name : string
}

@Table({
    tableName : 'currency'
})
export class Currency extends Model<Currency, CurrencyCreationAttrs> {

    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @Column({
        type          : DataType.STRING,
        unique        : true,
    })
    name : string;

}