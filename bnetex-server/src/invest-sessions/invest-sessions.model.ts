import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";

interface InvestSessionCreationAttrs {
    userId : number,
    startSessionTime : Date,
    tradeBalance : number
}

@Table({
    tableName : 'investSessions'
})
export class InvestSession extends Model<InvestSession, InvestSessionCreationAttrs> {
    
    @Column({
        type          : DataType.INTEGER,
        unique        : true,
        autoIncrement : true,
        primaryKey    : true
    })
    id : number;

    @ForeignKey(() => User)
    @Column({
        type          : DataType.INTEGER,
        allowNull     : false
    })
    userId : number;

    @Column({
        type : DataType.DATE,
        defaultValue : DataType.NOW,
        allowNull     : false
    })
    startSessionTime : Date;

    @Column({
        type : DataType.DATE,
        defaultValue : null
    })
    stopSessionTime : Date;

    @Column({
        type: DataType.DOUBLE,
        defaultValue: 0
    })
    lastPnl: number;

    @Column({
        type: DataType.DOUBLE,
        defaultValue: 0
    })
    lastRoe: number;

    @Column({
        type          : DataType.DOUBLE,
        defaultValue  : 0
    })
    tradeBalance : number;

    @BelongsTo(() => User)
    user : User;
}