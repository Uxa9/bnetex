import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
// import {WalletNetwork} from "../wallet/models/network.model";


interface TransactionCreationAttrs {
    userId : number
}

@Table({
    tableName : 'transactions'
})
export class Transaction extends Model<Transaction, TransactionCreationAttrs> {

    @ApiProperty({
        example : '1',
        description : 'unique transaction id'
    })
    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ApiProperty({
        example : '1',
        description : 'user id'
    })
    @ForeignKey(() => User)
    @Column({
        type : DataType.INTEGER
    })
    userId : number;
    
    @ApiProperty({
        example : '1',
        description : 'transaction id'
    })
    @Column({
        type : DataType.STRING
    })
    transactionId : string;

    @ApiProperty({
        example : 'https://givememoney.com',
        description : 'payment url'
    })
    @Column({
        type : DataType.STRING
    })
    invoiceUrl : string;

    @ApiProperty({
        example : 'processing',
        description : 'id of transaction status'
    })
    @Column({
        type : DataType.INTEGER
    })
    statusId : number;

    @ApiProperty({
        example : 'Ab0b4Ab0b4Ab0b4Ab0b4',
        description : 'payment address'
    })
    @Column({
        type : DataType.STRING
    })
    payAddress : string;

    // @ForeignKey(() => WalletNetwork)
    // @Column({
    //     type          : DataType.INTEGER,
    //     allowNull     : false
    // })
    // networkId : number;

    @ApiProperty({
        example : 123.45,
        description : 'amount of money'
    })
    @Column({
        type : DataType.DOUBLE
    })
    amount : number;

    // @BelongsTo(() => WalletNetwork)
    // network : WalletNetwork;

}