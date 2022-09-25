import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";


interface TransactionCreationAttrs {
    userId : string
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

    @BelongsTo(() => User)
    user : User;

    @ApiProperty({
        example : '1',
        description : 'user id'
    })
    @Column({
        type : DataType.INTEGER,
        allowNull : false
    })
    userId : number;

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