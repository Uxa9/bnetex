export var Pair = function(sequelize, DataTypes) {
    return sequelize.define('TRADING_PAIR', {

        
        Name: {
            type: DataTypes.STRING
        },

        Status: {
            type: DataTypes.BOOLEAN
        }
        
    }, )
}
