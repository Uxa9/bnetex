import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";


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

    // @ApiProperty({
    //     example : '1',
    //     description : 'user id'
    // })
    // @Column({
    //     type : DataType.INTEGER,
    //     allowNull : false
    // })
    // userId : number;
    
    @ApiProperty({
        example : '1',
        description : 'payment id'
    })
    @Column({
        type : DataType.INTEGER
    })
    paymentId : number;

    @ApiProperty({
        example : 'processing',
        description : 'id of transaction status'
    })
    @Column({
        type : DataType.INTEGER
    })
    statusId : number;

    @ApiProperty({
        example : 123.45,
        description : 'amount of money'
    })
    @Column({
        type : DataType.DOUBLE
    })
    amount : number;

}