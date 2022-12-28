const db = require("../../db/db");
const Positions = require("../../db/schemes/positions/Positions");
const getLastMinimalTimeframe = require("../getLastMinimalTimeframe");
const { ClosePosition } = require("../patterns/ClosePosition");
const getSinglePattern = require("../patterns/getSinglePattern");
const StrategyRules = require("../strategy/StrategyRules");

module.exports = async (pair, intervalsData) => {


    
    console.log("Checking position for close");

    

    let positions = await md.find({pair: pair, status: true})

    for (let index = 0; index < positions.length; index++) {
        const element = positions[index];

        let pattern = await getSinglePattern(element.patternEnter)
        

        if(!pattern || !pattern.CLOSE) continue;

        let patternCompare = StrategyRules(intervalsData, pattern.CLOSE, false, false)                
        
        if(patternCompare.result){
            console.log('Close Position')
            await ClosePosition(pair, element, lastMinimal.close, lastMinimal.time);


        }
    }

}