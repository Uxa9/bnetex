const {Schema, model} = require('mongoose');

const Position = new Schema({
    deposit: {
        type: Number
    },
    enterTime: {
        type: Number       
    },    
    enterPrice: {
        type: Number
    },
    avegarePrice: {
        type: Number
    },
    positionType: {
        type: String
    },
    status: {
        type: Boolean
    },
    pair: {
        type: String
    },
    volume: {
        type: Number
    },
    volumeUSDT: {
        type: Number
    },
    enterStep: {
        type: Number
    },
    closePrice: {
        type: Number
    },
    closeTime: {
        type: Number
    },
    percentProfit: {
        type: Number
    },
    sumProfit: {
        type: Number
    },
    patternEnter: {
        type: Number
    },
    lastEnterPrice: {
        type: Number
    },
    minPrice: {
        type: Number
    },
    minPricePercent: {
        type: Number
    },
    positionEnters: {
        type: Array
    }
    
})


module.exports = {
    name: 'Position',
    scheme: Position
};