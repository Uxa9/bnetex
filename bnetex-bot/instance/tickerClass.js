const { Observable } = require("rxjs");

const binance = require("./utils/binance");
const formatCandlesTick = require("./utils/formatCandlesTick");

const moment = require("moment");
const tickerHelper = require("./utils/tickerHelper");
const { pnlTIcker$ } = require("../server/events/events");

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

      binance.websockets.candlesticks(
        [this.pair],
        "1h",
        async (candlesticks) => {  
          
          

          let tick = formatCandlesTick(candlesticks);

          pnlTIcker$.next(tick);
          
          if (tick.isFinal) {            
            subject.next(tick);
          }
        }
      );

      this.timeframes.map((interval) => {
        binance.websockets.candlesticks(
          [this.pair],
          interval,
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
    });
    return this.nextIntervalsData$;
  }
};
