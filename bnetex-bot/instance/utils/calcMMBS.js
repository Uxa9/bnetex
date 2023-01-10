const timeframeRules = require("./timeframeRules");

// Скользящая средняя
module.exports = (klines, timeframe, ma, close) => {
  let result = {
    zone: 0,
    MMBs: [],
  };

  // Количество поиска
  const topCount = timeframeRules(timeframe).topCount;

  // Отклонения
  const deviations = klines.map((kline, index) => {
    return kline.close / kline.ma;
  }); // Вычисляем на всем диапазоне топовые отколнения вниз для всех подходящих свечек
  
  // Отклонения вниз
  const topsDown = deviations
    .sort((a, b) => {
      return a - b;
    })
    .slice(0, topCount); // Нашли топы
  // Отклонения вверх
  const topsUp = deviations
    .sort((a, b) => {
      return b - a;
    })
    .slice(0, topCount); // Нашли топы

  // Первая зона
  let firstZone =
    (topsDown.reduce((summ, a) => summ + a, 0) / topsDown.length) * ma;
  // Последняя зона
  let lastZone = (topsUp.reduce((summ, a) => summ + a, 0) / topsUp.length) * ma;

  // MMBS
  mmbsToCalcZone = [
    firstZone,
    (ma - firstZone) / 2 + firstZone,
    ma,
    (lastZone - ma) / 2 + ma,
    lastZone,
  ];

  // Сохраняем MMbs
  result.MMBs = [...mmbsToCalcZone];

  // Вычисляем текущую зону
  close = parseFloat(close);
  mmbsToCalcZone.push(close);
  mmbsToCalcZone = mmbsToCalcZone.sort((a, b) => a - b);
  result.zone = mmbsToCalcZone.indexOf(close);

  

  return {...result};
};
