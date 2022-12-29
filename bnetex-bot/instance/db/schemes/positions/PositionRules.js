const {Schema, model} = require('mongoose');

const PositionRules = new Schema({
    patternIndex: {
        type: Number
    },
    // Повторный вход в позицию
    positionIndex: {
        type: Number
    },

    // Процент от депозита
    depositPercent: {
        type: Number
    },

    priceDifferencePercent: {
        type: Number
    }
    
})


module.exports = {
    name: 'PositionRules',
    scheme: PositionRules
};