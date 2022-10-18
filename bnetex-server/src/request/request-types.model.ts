import { Column, DataType, Model, Table } from "sequelize-typescript";

interface RequestTypeCreationAttrs {
    type : string,
}

@Table({
    tableName : 'request-types'
})
export class RequestTypes extends Model<RequestTypes, RequestTypeCreationAttrs> {

    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @Column({
        type : DataType.STRING
    })
    type : string;
}