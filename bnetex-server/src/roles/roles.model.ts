import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { UserRoles } from "./user-roles.model";

interface RoleCreationAttrs {
    value : string,
    desc : string
}

@Table({
    tableName: 'roles'
})
export class Role extends Model<Role, RoleCreationAttrs> {
    
    @ApiProperty({
        example : '1',
        description : 'unique role id'
    })
    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ApiProperty({
        example : 'investor',
        description : 'user role'
    })
    @Column({
        type          : DataType.STRING,
        unique        : true,
        allowNull     : false
    })
    name : string;

    @ApiProperty({
        example : '50',
        description : 'Role invest profit percentage'
    })
    @Column({
        type          : DataType.INTEGER,
        defaultValue  : 50
    })
    investPercent : number;

    @ApiProperty({
        example : 'Investor',
        description : 'user role description'
    })
    @Column({
        type          : DataType.STRING
    })
    desc : string;
    
    @BelongsToMany(() => User, () => UserRoles)
    users: User[];

}