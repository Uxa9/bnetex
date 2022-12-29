module.exports = function(sequelize, DataTypes) {
    return sequelize.define('POSITION_ENTERS', {
        volume: {
            type: DataTypes.DOUBLE
        },
        volumeUSDT: {
            type: DataTypes.DOUBLE
        },
        step: {
            type: DataTypes.INTEGER
        },
        close: {
            type: DataTypes.DOUBLE
        },
        unittimestamp: {
            type: DataTypes.STRING
        }     
    }, )
}
