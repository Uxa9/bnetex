import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../users/users.model";
import { Currency } from "./currency.model";
import {Network} from "./network.model";
import { Wallet } from "./wallet.model";

interface WalletNetworkCreationAttrs {
    walletId : number,
    currencyId: number,
}

@Table({
    tableName : 'walletsNetwork'
})
export class WalletNetwork extends Model<WalletNetwork, WalletNetworkCreationAttrs> {

    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ForeignKey(() => Wallet)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    walletId : number;

    @ForeignKey(() => Currency)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    currencyId : number;

    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    amount : number;

}