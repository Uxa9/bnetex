const { Observable } = require("rxjs");

const { simulateEventer } = require("../utils/events");
const getPairDataFromExchange = require("../utils/getPairDataFromExchange");

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

              //console.log('callNextCandle:', e.startTime)

                

                let tick = {};
                
                if(this.klines.length <= 100){
                  if( e.startTime % 3600000 !== 0 &&  (e.startTime - 60000) % 3600000 !== 0 && (e.startTime + 60000) % 3600000 !== 0)
                  this.klines = await getPairDataFromExchange(this.pair, '1m', 1000, e.startTime + 60000);                  
                }

                tick = this.klines[1]

                
                this.klines.shift();

                

                this.klinesToForce[tick.interval] = tick;

                 subject.next(this.klinesToForce)

                //this.index++;

            })
        })
      }

}