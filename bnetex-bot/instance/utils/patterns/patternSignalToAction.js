const StrategyRules = require("../strategy/StrategyRules");
const getAllPatterns = require("./getAllPatterns");

module.exports = async (intervalsData) => {


  

  // Достаем все паттерны
  let patterns = await getAllPatterns({ status: true });

  let patternAnalyze = undefined;

  let _rules = [];

  patterns
    .sort((a, b) => a.groupIndex - b.groupIndex)
    .map((pattern) => {
      // Получаем все интервалы внутри паттерна
      let intervals = [...new Set(pattern.VARIATIONS.map((i) => i.timeframe))];
      let rule = {};

      intervals.map((interval) => {
        rule[interval] = {
          variations: pattern.VARIATIONS.filter(
            (i) => i.timeframe == interval
          ).map((i) => {
            return {
              back: i.back,
              prev: i.prev,
              zone: i.zone,
              index: pattern.groupIndex,
            };
          }),
        };
      });

      _rules.push(rule);
    });

  patternAnalyze = StrategyRules(intervalsData, [], _rules);

  return {
    PATTERN__INDEX: patternAnalyze.pattern || false,
    SIGNAL: patternAnalyze.result || false,
  };
};
