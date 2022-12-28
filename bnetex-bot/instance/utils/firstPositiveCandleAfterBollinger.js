var BB = require("technicalindicators").BollingerBands;
var moment = require("moment");

module.exports = (candles) => {
  
  

  // Надо определить, подходит ли текущая точка для входа без учета паттернов входа
  candles = candles.map((i) => {
    return {
      ...i,
      close: parseFloat(i.close),
      open: parseFloat(i.open),
    };
  });

  let lastCandle = candles[candles.length - 1];

  // Если свеча медвежья - сразу нет
  if (lastCandle.open > lastCandle.close) return false;
  
  

  // Смотрим дальше
  // Листаем в обратном порядке, если до ББ нет ни одной зеленой - сигнал на покупку
  candles = candles.sort((a, b) => b.startTime - a.startTime);

  let signal = false;

  for (let index = 1; index < candles.length; index++) {

    const element = candles[index];    

    if (element.close > element.open) break;

    signal = true;

  }

  
  return signal;
};
