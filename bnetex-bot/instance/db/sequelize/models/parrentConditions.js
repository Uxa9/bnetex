module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PATTERN_CONDITIONS', {

        dpercent: {
            type: DataTypes.STRING            
        },
        step: {
            type: DataTypes.INTEGER
        }
        
    }, )
}
