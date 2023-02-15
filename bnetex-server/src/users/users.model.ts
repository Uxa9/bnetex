import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Request } from "../request/request.model";
import { InvestSession } from "../invest-sessions/invest-sessions.model";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";
import { StringBoolean } from "binance";

interface UserCreationAttrs {
    email : string,
    password : string
}

@Table({
    tableName : 'users'
})
export class User extends Model<User, UserCreationAttrs> {
    
    @ApiProperty({
        example : '1',
        description : 'unique user id'
    })
    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ApiProperty({
        example : 'bnetex@bne.tex',
        description : 'user e-mail'
    })
    @Column({
        type          : DataType.STRING,
        unique        : true,
        allowNull     : false
    })
    email : string;

    @ApiProperty({
        example : true,
        description : 'does user confirmed e-mail or not'
    })
    @Column({
        type : DataType.BOOLEAN,
        defaultValue : false
    })
    isActivated : boolean;

    @ApiProperty({
        example : 'https://natribu.org/en/',
        description : 'link for account activation'
    })
    @Column({
        type          : DataType.STRING,
        allowNull     : true
    })
    activationLink : string;

    @ApiProperty({
        example : '1',
        description : 'activation link timestamp'
    })
    @Column({
        type : DataType.DATE,
        defaultValue : DataType.NOW
    })
    linkTimestamp : Date;

    @ApiProperty({
        example : 'aboba228',
        description : 'user password'
    })
    @Column({
        type          : DataType.STRING,
        allowNull     : false
    })
    password : string;

    @ApiProperty({
        example : '123.45',
        description : 'amount of money on main wallet'
    })
    @Column({
        type          : DataType.DOUBLE,
        defaultValue  : 0
    })
    mainWallet : number;

    @ApiProperty({
        example : '123.45',
        description : 'amount of money on invest wallet'
    })
    @Column({
        type          : DataType.DOUBLE,
        defaultValue  : 0
    })
    investWallet : number;

    @Column({
        type : DataType.BOOLEAN,
        defaultValue : false
    })
    openTrade : boolean;

    @Column({
        type          : DataType.DOUBLE,
        defaultValue  : 0
    })
    tradeBalance : number;

    @Column({
        type          : DataType.STRING,
        allowNull     : true
    })
    api_key : string;
    
    @Column({
        type          : DataType.STRING,
        allowNull     : true
    })
    api_secret : string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => InvestSession)
    investSessions: InvestSession[];

    @HasMany(() => Request)
    requests: Request[];

}