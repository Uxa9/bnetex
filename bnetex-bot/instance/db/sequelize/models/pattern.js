module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PATTERN', {
        status: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        LOGICAL_GROUP: {
            type: DataTypes.STRING,
            default: null
        },

        WORKING_GROUP: {
            type: DataTypes.STRING
        },

        PART_OF_VOLUME: {
            type: DataTypes.DOUBLE
        },
        PERCENT_OF_DEPOSIT: {
            type: DataTypes.DOUBLE
        }
    }, )
}
