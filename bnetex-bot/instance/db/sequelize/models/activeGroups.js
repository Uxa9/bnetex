module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ACTIVE_GROUPS', {

        
        ProfitPercent: {
            type: DataTypes.DOUBLE
        }
        
    }, )
}
