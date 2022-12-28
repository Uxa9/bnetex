const {Schema, model} = require('mongoose');

const Pattern = new Schema({
    
    status: {
        type: Boolean
    },
    mode: {
        type: String        
    },
    groupIndex: {
        type: Number
    }
})


module.exports = {
    name: 'Pattern',
    scheme: Pattern
};