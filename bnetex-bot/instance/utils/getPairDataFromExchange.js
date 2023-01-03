// Получение данные с биржи

const binance = require("./binance");
const timeframeRules = require("./timeframeRules");

const configFile = require("../../config/config")();

var moment = require("moment");

module.exports = async (pair, timeframe, limit, startTimeFrom = false, lastTime = false) => {




  // Рассчитываем время - откуда считать
  let startTime =
    moment(new Date()).format("x") -
    timeframeRules(timeframe).singleMilliseconds * limit;

  

  if(configFile.simulate){
    startTime = configFile.startTime - timeframeRules(timeframe).singleMilliseconds * limit;
  }

  

  // Отнимаем одну свечу на всякий случай
  startTime = startTime - timeframeRules(timeframe).singleMilliseconds;


  if(startTimeFrom !== false){
    startTime = startTimeFrom;
  }

  // Хранение свех свечей
  let data = [];




  // binance дает только 1000 свечей за раз, поэтому приходится несколько раз забирать
  do {

    
    let dataFromExhange = await getFromExchange(
      limit,
      startTime,
      pair,
      timeframe
    );

    
    

    data = data.concat(dataFromExhange);

    startTime =
      data[data.length - 1].startTime +
      timeframeRules(timeframe).singleMilliseconds;

    

  } while (data.length < limit);
  
  
  if(lastTime){
    data = data.filter(i => i.startTime <= lastTime)
  }
  return data;
};

let getFromExchange = async (limit, startTime, pair, timeframe) => {
  return new Promise(async (res, rej) => {
    let a = await binance.candlesticks(
      pair,
      timeframe,
      async (err, a, symbol) => {
        let result = [];
        let attributes = [
          "startTime",
          "open",
          "high",
          "low",
          "close",
          "volume",
          "endTime",
          "quoteVolume",
          "trades",
          "takerBuyBaseVolume",
          "takerBuyQuoteVolume",
          "Ignore",
        ];

        

        a.map((i, index) => {
          let obj = {};
          i.map((attr, index) => {
            obj[[attributes[index]]] = attr;
          });

          // Устанавливаем интервал
          obj["interval"] = timeframe;
          obj["symbol"] = pair;
          if (index == a.length - 1) return;

          result.push(obj);
        });

        res(result);
      },
      { limit: limit, startTime }
    );
  });
};