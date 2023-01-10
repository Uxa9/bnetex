const patternScheme = require("../../db/schemes/patterns");

const db = require("../../db/db");
const getAllPatterns = require("./getAllPatterns");
const StrategyRules = require("../strategy/StrategyRules");
const { UpdatePattern } = require("./updatePattern");
const { GetCurrentPositions } = require("../positions/getCurrentPosition");
const { ClosePosition } = require("./ClosePosition");
const getLastMinimalTimeframe = require("../getLastMinimalTimeframe");
const getPatterntMySQL = require("../../db/sequelize/actions/patterns/getPatterntMySQL");
const updatePatternMySQL = require("../../db/sequelize/actions/patterns/updatePatternMySQL");
const getCurrentPositionMySQL = require("../../db/sequelize/actions/positions/getCurrentPositionMySQL");
const { getBBRulesIndexes, getBBRuleByIddex } = require("../BollZoneRules");
const { sendMessageToMainChanel } = require("../telegram/tg");


const log = require('log-to-file');

let savedPatterns = undefined;

module.exports = {
  tradingPatternsChecker: async (intervalsData, pair) => {
    
    let patterns = undefined;


    // Т.к паттерны всегда одинаковые, просто записываем их в память, а то MySQL 0.3 секунды их возвращает
    if (savedPatterns === undefined) {
      patterns = await getPatterntMySQL();
      savedPatterns = patterns;
    } else {
      patterns = savedPatterns;
    }

    //console.log({intervalsData})

    for (let index = 0; index < patterns.length; index++) {
      const element = patterns[index];

      // Получаем все таймфрейвы учавствующие в активации

      let triggers = [];

      if (element.status) {
        triggers = groupByRules(
          element.PATTERN_TRIGGERs.filter((i) => i.type == "DEACTIVATION")
        );
      } else {
        triggers = groupByRules(
          element.PATTERN_TRIGGERs.filter((i) => i.type == "ACTIVATION")
        );
      }

      let patternCompare = StrategyRules(intervalsData, triggers, true, false);

      // Если схема отработала - активируем/деактивируем паттерн
      if (patternCompare) {


        await updatePatternMySQL({ status: !element.status }, element.id);

        savedPatterns = await getPatterntMySQL();

        let action = 'АКТИВАЦИЯ';

        if(element.status){
          action = 'ДЕАКТИВАЦИЯ';
        }

        console.log(`${action} паттерна №${element.id}`);
        console.log(`Время свечи 1м ${intervalsData.startTime}`);
        
        log(`${action} паттерна №${element.id}`, 'activation-log.log', '\r\n');
        log(`Время свечи 1м ${intervalsData.startTime}`, 'activation-log.log', '\r\n');

        //await sendMessageToMainChanel(`${action} паттернра №${element.id}`);

        //await sendMessageToMainChanel(`Время свечи 1м ${intervalsData.startTime}`); 

        // // Надо проверить позиции по паттерну
        // if(element.status){

        //     let position = await getCurrentPositionMySQL({pair, status: true});

        //     if(!position) return;
        //     // Если паттерн деактивируется, надо првоерить может быть по этому паттерну есть позиции - закрыть их

        //     if(position.patternEnter == element.groupIndex){
        //     //     let minimalTimeframe = getLastMinimalTimeframe(intervalsData);

        //     //     await ClosePosition(position, minimalTimeframe.close, minimalTimeframe.startTime, true)
        //     // }
        // }
      }
    }
  },

  checkPatternToOpen: async (intervalsData, log = false) => {
    // return {
    //     signal: true,
    //     pattern: 70
    // }

    let patterns = await getPatterntMySQL({ status: true });

    let patternsToOpen = [];

    for (let index = 0; index < patterns.length; index++) {
      const element = patterns[index];

      for (let j = 0; j < element.ACTIVE_GROUPs.length; j++) {
        const AG = element.ACTIVE_GROUPs[j];

        if (
          AG.ACTIVE_GROUP_TRIGGERs.filter((i) => i.type == "OPEN").length == 0
        )
          continue;

        let groupped = groupByRules(
          AG.ACTIVE_GROUP_TRIGGERs.filter((i) => i.type == "OPEN")
        );

        let groupSignal = StrategyRules(intervalsData, groupped, true);

        if (groupSignal) {
          patternsToOpen.push(AG.id);
        }
      }

      //let patternCompare = StrategyRules(intervalsData, element.PATTERN_TRIGGERs.filter(i => i.type == 'OPEN'), log)

      // if(patternCompare){
      //     patternsToOpen.push(element.id);
      // }
    }

    if (patternsToOpen.length == 0) return { signal: false };

    return {
      signal: true,
      pattern: patternsToOpen.sort((a, b) => b - a)[0],
    };
  },
};

const groupByRules = (ACTIVE_GROUP_TRIGGERs) => {
  //console.log('groupping')

  let zoneRulesBB = getBBRulesIndexes();

  let rules = zoneRulesBB.map((i) => getBBRuleByIddex(i));

  let grouppedTriggers = rules.map((i) =>
    ACTIVE_GROUP_TRIGGERs.filter(
      (j) => j.sigma == i.sigma && j.intervals == i.intervals
    )
  );

  return grouppedTriggers.filter((i) => i.length > 0);
};
