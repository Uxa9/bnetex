const patternScheme = require('../../db/schemes/patterns')

const db = require('../../db/db');
const patternTriggers = require('../../db/schemes/patternTriggers');
const PatternVariations = require('../../db/schemes/PatternVariations');

module.exports = async (filter__in = false) => {

    let patternsDB = await db(patternScheme);

    let triggerMD = await db(patternTriggers)

    let patternVariation = await db(PatternVariations)

    let filter = {};
    
    if(filter__in){
        filter = filter__in;
    }

    let patterns = await patternsDB.find(filter).sort({groupIndex: -1});

    patterns = JSON.parse(JSON.stringify(patterns));

    for (let index = 0; index < patterns.length; index++) {        

        patterns[index]['ACTIVATION'] = await triggerMD.find({PatternId: patterns[index].groupIndex, TriggerType: "ACTIVATION"});                
        patterns[index]['DEACTIVATION'] = await triggerMD.find({PatternId: patterns[index].groupIndex, TriggerType: "DEACTIVATION"});    
        patterns[index]['VARIATIONS'] = await patternVariation.find({patternIndex: patterns[index].groupIndex});    

    }
    

      
    return patterns;
    
}