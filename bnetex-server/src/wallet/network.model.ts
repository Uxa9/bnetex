import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Wallets} from "./wallet.model";


interface NetworkCreationAttrs {
    name : string
}

@Table({
    tableName : 'walletNetwork'
})
export class WalletNetwork extends Model<WalletNetwork, NetworkCreationAttrs> {

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

    @HasMany(() => Wallets)
    wallets: Wallets[];

}