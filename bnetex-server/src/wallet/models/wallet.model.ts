import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../../users/users.model";
import {Network} from "./network.model";

interface WalletCreationAttrs {
    userId  : number,
    walletId : string
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

    @Column({
        type          : DataType.STRING,
        allowNull     : false
    })
    walletId : number;

    @ForeignKey(() => User)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    userId : number;

    @BelongsTo(() => User)
    user : User;

    // @HasMany(() => Network)
    // networks: Network[];

}