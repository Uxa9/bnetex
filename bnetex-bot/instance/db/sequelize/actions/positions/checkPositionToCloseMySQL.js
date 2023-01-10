const { getBBRulesIndexes, getBBRuleByIddex } = require("../../../../utils/BollZoneRules");
const StrategyRules = require("../../../../utils/strategy/StrategyRules");
const db = require("../../dbseq");
const closePositionMySQL = require("./closePositionMySQL");
const getCurrentPositionMySQL = require("./getCurrentPositionMySQL");
const getPosition = require("./getPosition");
const setMinPriceMySQL = require("./setMinPriceMySQL");
const UpdatePositionMySQL = require("./UpdatePositionMySQL");


module.exports = async (pair, kline) => {
    
    //console.log('Checking SQL Position for close')

    let position = await getCurrentPositionMySQL({pair, status: true});

    
    if(!position) return;

    if((parseFloat(kline.close) < position.minPrice) || !position.minPrice) await setMinPriceMySQL(position.id, parseFloat(kline.close))

    let PercentProfit = position.ACTIVE_GROUP.ProfitPercent;

    let groupped = groupByRules(position.ACTIVE_GROUP.ACTIVE_GROUP_TRIGGERs.filter(i => i.type == 'CLOSE'))

    // Проверка на паттерн закрытия
    let patternCompare = StrategyRules(kline, groupped, true)


    if(!patternCompare) return;


    
    await closePositionMySQL(pair, kline, PercentProfit)
    
}




const groupByRules = (ACTIVE_GROUP_TRIGGERs) => {
    
    
    let zoneRulesBB = getBBRulesIndexes();

    let rules = zoneRulesBB.map(i => getBBRuleByIddex(i))

    let grouppedTriggers = rules.map(i => ACTIVE_GROUP_TRIGGERs.filter(j => j.sigma == i.sigma && j.intervals == i.intervals))

    return grouppedTriggers.filter(i => i.length > 0);
    
}