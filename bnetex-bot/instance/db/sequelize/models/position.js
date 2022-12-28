module.exports = function(sequelize, DataTypes) {
    return sequelize.define('POSITION', {
        deposit: {
            type: DataTypes.DOUBLE
        },
        enterPrice: {
            type: DataTypes.DOUBLE
        },
        avegarePrice: {
            type: DataTypes.DOUBLE
        },
        enterTime: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        positionType: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        pair: {
            type: DataTypes.STRING
        },
        volumeACTIVE: {
            type: DataTypes.DOUBLE
        },
        volumeUSDT: {
            type: DataTypes.DOUBLE
        },
        enterStep: {
            type: DataTypes.INTEGER
        },
        closePrice: {
            type: DataTypes.DOUBLE
        },
        closeTime: {
            type: 'TIMESTAMP',            
        },
        percentProfit: {
            type: DataTypes.DOUBLE
        },
        sumProfit: {
            type: DataTypes.DOUBLE
        },
        lastEnterPrice: {
            type: DataTypes.DOUBLE
        },
        minPrice: {
            type: DataTypes.DOUBLE
        }
        
    }, )
}
