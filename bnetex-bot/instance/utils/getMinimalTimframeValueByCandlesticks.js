const timeframeRules = require("./timeframeRules");

const config = require("../../config/config")();

module.exports = (candlesticks, len = 1) => {
  let timeframe = config.tradingTimeframes.sort(
    (a, b) =>
      timeframeRules(a).singleMilliseconds -
      timeframeRules(b).singleMilliseconds
  )[0]


  
    
  if(len == 1){
    return candlesticks[timeframe][candlesticks[timeframe].length -1]
  }else if(len > 1){
    return candlesticks[timeframe].slice(candlesticks[timeframe].length - len, candlesticks[timeframe].length)
  }
  
};
