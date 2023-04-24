const { Observable } = require("rxjs");
var WebSocket = require('ws')

const binance = require("../utils/binance");
const formatCandlesTick = require("../utils/formatCandlesTick");

const moment = require("moment");
const tickerHelper = require("../utils/tickerHelper");
const { pnlTIcker$ } = require("../../server/events/events");
const LocalStore = require("../utils/LocalStore");

// В этом классе порисходит подписка на тики бинанс, происходит просчет ожиданий какие таймфреймы закроются следущие
module.exports = class TickerClass {
  constructor(pair, timeframes) {
    this.pair = pair;
    this.timeframes = timeframes;

    this.nextIntervalsData$ = undefined;

    this.klinesToForce = {};

    // Время следущей свечи
    this.nextKlinTime = undefined;

    // Количество ожидаемых свечей
    this.countOfIntervalsToClose = undefined;
  }

  initializingSubscribtion() {
    this.nextIntervalsData$ = Observable.create((subject) => {
      console.log("In Observable");

      // Время старта следщей минутки
      this.nextKlinTime =
        Math.floor(moment(new Date()).format("x") / 60000) * 60000 + 60000;
      this.countOfIntervalsToClose = tickerHelper.countKlinesByTime(
        this.nextKlinTime
      );

      // binance.futuresSubscribe(`${this.pair.toLowerCase()}@kline_1h`, 
      //   async (candlesticks) => {  
          
          

      //     let tick = formatCandlesTick(candlesticks);

      //     pnlTIcker$.next(tick);
          
      //     LocalStore.setStoreValue(`${this.pair.toLowerCase()}__LASTPRICE`, tick.close);
          
      //     if (tick.isFinal) {            
      //       subject.next(tick);
      //     }
      //   }
      // );

        //binance.futuresAggTradeStream( this.pair.toUpperCase(), console.log );
        
        var tradeStream = new WebSocket(`wss://fstream.binance.com/ws/${this.pair.toLowerCase()}@aggTrade`);        

        tradeStream.on('message', (message) => {
          let response = JSON.parse(message);          
          let close = parseFloat(response['p'])
          pnlTIcker$.next({close, symbol: this.pair.toUpperCase()});
        })
      
        binance.futuresSubscribe(`${this.pair.toLowerCase()}@kline_1m`,          
          
          async (candlesticks) => {
            
            let tick = formatCandlesTick(candlesticks);
            
            
            

            if (tick.isFinal) {
              this.klinesToForce[tick.interval] = tick;

              // Если количество ожидаемых свечей по закрытию этой минуты совпадает с фактом - отправляем в алгоритм
              if (
                Object.keys(this.klinesToForce).length ==
                this.countOfIntervalsToClose
              ) {
                subject.next(this.klinesToForce);

                this.klinesToForce = {};

                this.nextKlinTime = tick.endTime + 60001;

                this.countOfIntervalsToClose = tickerHelper.countKlinesByTime(
                  this.nextKlinTime
                );
              }
            }
          }
        );
      
    });
    return this.nextIntervalsData$;
  }
};
