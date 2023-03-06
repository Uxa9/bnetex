import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {WalletNetwork} from "./network.model";

interface WalletCreationAttrs {
    networkId : number,
    userId  : number,
    balance : number
}

@Table({
    tableName : 'wallets'
})
export class Wallet extends Model<Wallet, WalletCreationAttrs> {

    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ForeignKey(() => WalletNetwork)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    networkId : number;

    @ForeignKey(() => User)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    userId : number;

    @Column({
        type          : DataType.INTEGER,
        defaultValue : 0,
    })
    balance : number;

    @BelongsTo(() => User)
    user : User;

    @BelongsTo(() => WalletNetwork)
    network : WalletNetwork;

}