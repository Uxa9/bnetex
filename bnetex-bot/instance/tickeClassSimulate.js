const { Observable } = require("rxjs");

const { simulateEventer } = require("./utils/events");
const getPairDataFromExchange = require("./utils/getPairDataFromExchange");

const moment = require('moment');

module.exports = class TickerClassSimulate {


    constructor(pair, timeframes) {
        
        this.pair = pair;
        this.timeframes = timeframes;
    
        this.nextIntervalsData$ = undefined;
    
        this.klinesToForce = {};
    
        // Время следущей свечи
        this.nextKlinTime = undefined;
    
        // Количество ожидаемых свечей
        this.countOfIntervalsToClose = undefined;

        this.klines = [];

        this.isProcess = true;

        this.index = 0;
      }



      initializingSubscribtion(){
        return Observable.create((subject) => {

          
            simulateEventer.on('callNextCandle', async (e) => {

              

                if(this.index > 1) return;

                let tick = {};
                
                if(this.klines.length <= 1){
                  this.klines = await getPairDataFromExchange(this.pair, '1m', 1000, e.startTime);
                }

                tick = this.klines[1]
                this.klines.shift();

                //console.log({ticktime: moment(tick.startTime, 'x').format('DD MM YYYY HH:mm'), st: tick.startTime})                

                this.klinesToForce[tick.interval] = tick;

                 subject.next(this.klinesToForce)

                //this.index++;

            })
        })
      }

}