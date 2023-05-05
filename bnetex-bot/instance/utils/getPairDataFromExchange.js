// Получение данные с биржи

const binance = require("./binance");
const timeframeRules = require("./timeframeRules");

const configFile = require("../../config/config")();

var moment = require("moment");

module.exports = async (pair, timeframe, limit, startTimeFrom = false, lastTime = false) => {


  console.log('Запрос еще 1000')

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
      data[data.length - 1].startTime

      

  } while (data.length < limit);
  
  
  if(lastTime){
    data = data.filter(i => i.startTime <= lastTime)
  }

  await new Promise((res, rej) => {
    setTimeout(() => {res()}, 900)
  })

  return data;
};

let getFromExchange = async (limit = 1000, startTime, pair, timeframe) => {
  return new Promise(async (res, rej) => {

    if(limit > 1500) limit = 1500;
    await binance.publicRequest('https://fapi.binance.com/fapi/v1/klines', {
        symbol: 'BTCUSDT',
        interval: timeframe,
        startTime: startTime,  
        limit: limit,  
    }, async (err, a) => {
      
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
    });
    
    

    // let a = await binance.candlesticks(
    //   pair,
    //   timeframe,
    //   async (err, a, symbol) => {
    //     let result = [];
    //     let attributes = [
    //       "startTime",
    //       "open",
    //       "high",
    //       "low",
    //       "close",
    //       "volume",
    //       "endTime",
    //       "quoteVolume",
    //       "trades",
    //       "takerBuyBaseVolume",
    //       "takerBuyQuoteVolume",
    //       "Ignore",
    //     ];

        console.log(err);

    //     a.map((i, index) => {
    //       let obj = {};
    //       i.map((attr, index) => {
    //         obj[[attributes[index]]] = attr;
    //       });

    //       // Устанавливаем интервал
    //       obj["interval"] = timeframe;
    //       obj["symbol"] = pair;
    //       if (index == a.length - 1) return;

    //       result.push(obj);
    //     });

    //     res(result);
    //   },
    //   { limit: limit, startTime }
    // );
  });
};
