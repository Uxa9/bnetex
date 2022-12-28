const timeframeRules = require("./timeframeRules");
const zoneCorrector = require("./ZoneCorrector");

const config = require("../../config/config")();

module.exports = {
  // Считает сколько свечей должно закрыть в следущую минуту
  countKlinesByTime: (time) => {
    return config.tradingTimeframes
      .map((interval) => {
        return time % timeframeRules(interval).singleMilliseconds == 0;
      })
      .filter((i) => i).length;
  },
  convertKlines: (klinesData) => {
    
    return zoneCorrector(klinesData);
  },

  // Вычисление паттерна назад и предыдущей зоны
  prevAndBackPattern: (klines, currentZone) => {
    

    // Сортируем от последнего
    let zones = klines.sort((a, b) => b.startTime - a.startTime);    

    // Предыдущая поза
    let prevZone = undefined;

    //let currentZone = zones[0].zone;

    // Паттерн назад
    let backPattern = [...new Set(zones.map(i => i.zone))].filter(i => i != currentZone).slice(0, 3);

    

    




    return {
      prevZone: backPattern[0],
      back: backPattern.sort((a, b) => a - b),
    };
  },
};
