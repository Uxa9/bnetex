const patternScheme = require('../../db/schemes/patterns')

const db = require('../../db/db');
const patternTriggers = require('../../db/schemes/patternTriggers');
const PatternVariations = require('../../db/schemes/PatternVariations');

module.exports = async (groupIndex = undefined) => {

    let patternsDB = await db(patternScheme);

    let triggerMD = await db(patternTriggers)

    let patternVariation = await db(PatternVariations)

    let filter = {};

    if(groupIndex !== undefined){
      filter['groupIndex'] = groupIndex;
    }

    

    let patterns = await patternsDB.find(filter);

    patterns = JSON.parse(JSON.stringify(patterns));

    for (let index = 0; index < patterns.length; index++) {        

        patterns[index]['ACTIVATION'] = await triggerMD.find({PatternId: patterns[index].groupIndex, TriggerType: "ACTIVATION"});                
        patterns[index]['DEACTIVATION'] = await triggerMD.find({PatternId: patterns[index].groupIndex, TriggerType: "DEACTIVATION"});    
        patterns[index]['CLOSE'] = await triggerMD.find({PatternId: patterns[index].groupIndex, TriggerType: "CLOSE"});    
        patterns[index]['VARIATIONS'] = await patternVariation.find({patternIndex: patterns[index].groupIndex});    

    }
    

      
    if(patterns.length > 0){
        return patterns[0];
    }else{
        return false;
    }
    
}