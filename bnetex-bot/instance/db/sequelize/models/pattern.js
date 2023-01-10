module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PATTERN', {
        status: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    }, )
}
