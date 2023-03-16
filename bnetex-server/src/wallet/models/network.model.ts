import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
// import {Wallet} from "./wallet.model";


interface NetworkCreationAttrs {
    name : string
}

@Table({
    tableName : 'network'
})
export class Network extends Model<Network, NetworkCreationAttrs> {

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