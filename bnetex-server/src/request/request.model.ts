import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from '../users/users.model';

interface RequestCreationAttrs {
    userId : number,
    amount : number,
    type   : number,
    confirmCode : string
}

@Table({
    tableName : 'request'
})
export class Request extends Model<Request, RequestCreationAttrs> {

    @ApiProperty({
        example : '1',
        description : 'unique request id'
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
        type : DataType.INTEGER,
        allowNull : false
    })
    userId : number;

    @ApiProperty({
        example : 'TQwckR7VpEsrMFCogvjKhiQ1YJBNi5Qbjm',
        description : 'user outer wallet address'
    })
    @Column({
        type : DataType.STRING
    })
    walletAddress : string;

    @ApiProperty({
        example : 123.45,
        description : 'amount of money'
    })
    @Column({
        type : DataType.DOUBLE,
        allowNull : false
    })
    amount : number;

    @ApiProperty({
        example : "1",
        description : 'request type id'
    })
    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    type : number;

    @ApiProperty({
        example : "322228",
        description : 'request confirm code'
    })
    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    confirmCode : string;

    @ApiProperty({
        example : "false",
        description : 'request status'
    })
    @Column({
        type : DataType.BOOLEAN,
        defaultValue: false
    })
    fulfilled : boolean;

    @BelongsTo(() => User)
    user : User;
}