const {Schema, model} = require('mongoose');

const PatternVariations = new Schema({
    back: {
        type: Array        
    },    
    prev: {
        type: Number
    },
    zone: {
        type: Number
    },
    timeframe: {
        type: String
    },
    patternIndex: {
        type: Number
    }
})


module.exports = {
    name: 'PatternVariations',
    scheme: PatternVariations
};