module.exports = function(sequelize, DataTypes) {
    return sequelize.define('POSITION_RULES', {
        depositPercent: {
            type: DataTypes.DOUBLE
        },

        priceDifferencePercent: {
            type: DataTypes.DOUBLE
        },

        positionIndex: {
            type: DataTypes.DOUBLE
        }

    }, )
}
