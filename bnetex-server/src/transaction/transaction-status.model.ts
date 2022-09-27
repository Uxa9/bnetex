import { Column, DataType, Model, Table } from "sequelize-typescript";

interface TransactionStatusCreationAttrs {
    name : string,
}

@Table({
    tableName : 'transaction-statuses'
})
export class TransactionStatus extends Model<TransactionStatus, TransactionStatusCreationAttrs> {

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
    name : string;
}