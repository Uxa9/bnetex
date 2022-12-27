import {Column, DataType, Model, Table} from "sequelize-typescript";

interface PositionEntersCreationAttrs {

}

@Table({
    tableName : 'POSITION_ENTERS'
})
export class PositionEnters extends Model<PositionEnters, PositionEntersCreationAttrs> {

    @Column({
        type : DataType.DOUBLE
    })
    volume : number;

    @Column({
        type : DataType.DOUBLE
    })
    volumeUSDT : number;

    @Column({
        type : DataType.INTEGER
    })
    step : number;

    @Column({
        type : DataType.DOUBLE
    })
    close : number;

    @Column({
        type : DataType.STRING
    })
    unittimestamp : number;
}