module.exports = function(sequelize, DataTypes) {
    return sequelize.define('WEEK_MATCHING', {        
        LOGICAL_GROUP: {
            type: DataTypes.STRING,
            default: null
        },
        tradingVolume: {
            type: DataTypes.DOUBLE
        },
        MACRO_WEEK_SITUATION_INDEX: {
            type: DataTypes.INTEGER
        },
        MICRO_WEEK_SITUATION_INDEX: {
            type: DataTypes.INTEGER
        }
    }, )
}
