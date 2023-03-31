module.exports = function(sequelize, DataTypes) {
    return sequelize.define('POSITION_RULES', {
        depositPart: {
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
