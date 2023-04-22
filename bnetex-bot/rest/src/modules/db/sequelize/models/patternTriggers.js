module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PATTERN_TRIGGERS', {
        type: {
            type: DataTypes.STRING            
        },
        back: {
            type: DataTypes.STRING
        },
        prev: {
            type: DataTypes.INTEGER
        },
        zone: {
            type: DataTypes.INTEGER
        },
        intervals: {
            type: DataTypes.INTEGER
        },
        sigma: {
            type: DataTypes.INTEGER
        }
    }, )
}
