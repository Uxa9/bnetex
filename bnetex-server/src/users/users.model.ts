import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Default, Model, Table } from "sequelize-typescript";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";

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
        example : 'true',
        description : 'does user confirmed e-mail or not'
    })
    @Column({
        type : DataType.BOOLEAN,
    })
    @Default(false)
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
        example : 'aboba228',
        description : 'user password'
    })
    @Column({
        type          : DataType.STRING,
        allowNull     : false
    })
    password : string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
    
}