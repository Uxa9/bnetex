const {Schema, model} = require('mongoose');

const PatternTrigger = new Schema({
    
    PatternId: {
        type: Number
    },
    TriggerType: {
        type: String
    },
    TimeFrame: {
        type: String
    },
    BackPattern: {
        type: Array
    },
    PrevZone: {
        type: Number
    },
    CurrentZone: {
        type: Number
    }
})


module.exports = {
    name: 'PatternTrigger',
    scheme: PatternTrigger
};