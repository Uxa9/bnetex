import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../users/users.model";
import {Network} from "./network.model";

interface WalletNetworkCreationAttrs {
    networkId  : number,
    walletId : number
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

    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    walletId : number;

    @ForeignKey(() => Network)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    networkId : number;



}