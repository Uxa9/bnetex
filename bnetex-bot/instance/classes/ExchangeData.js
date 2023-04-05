const TickerClassSimulate = require("./tickeClassSimulate");
const TickerClass = require("./tickerClass");
const { getMaxIntervals, getBBRulesIndexes, getBBRuleByIddex } = require("../utils/BollZoneRules");
const compareCandlesticks = require("../utils/compareCandlesticks");
const { simulateEventer } = require("../utils/events");
const getPairDataFromExchange = require("../utils/getPairDataFromExchange");
const { CalcBollingerComplex } = require("../utils/strategy/CalcBollengerComplex");
const { CalcPrevZone } = require("../utils/strategy/CalcPrevZone");
const { CalcZonesByBB } = require("../utils/strategy/CalcZonesByBB");
const EventEmitter = require('events');
const { Observable } = require("rxjs");
var colors = require('colors');

const config = require("../../config/config")();

module.exports = class ExchangeData {
     
    constructor(pair){

        this.lastHour = undefined;

        this.pair = pair;

        this.startHourDate = undefined;

        this.candlesticks = undefined;

        this.candlesticks_1h = undefined;

        this.tradingTimeframes = config.tradingTimeframes;

        // Event сигнализирующий о наличии просчитаной новой свечи
        this.throwNextCandle = new EventEmitter()
        
    }

    subscribeNext(){

        return Observable.create((subject) => {
            this.throwNextCandle.on('next', () => {              
                subject.next({
                  last: this.candlesticks[this.candlesticks.length-1],
                  last_100: this.candlesticks.slice(-100)
                })
            })
        })

    }


    async initializing(){

        
        

        // Получаем максимальное количество интервалов
        let maxInterval = getMaxIntervals() * 4;

        // Весь просчет по новой стратегии идет по 1m
        // Максимальное количество нужных свечей
        let candlesticks = [];

        // Свечи 60м для просчета давних отклонений
        let candlesticks_1h = [];

        if (this.candlesticks == undefined || !this.candlesticks) {

            // Для минутки оптимальное количество 4320
            candlesticks = await getPairDataFromExchange(this.pair, "1m", 2880);

            // Все остальное запихиваем в 30м
            candlesticks_1h = await getPairDataFromExchange(
                this.pair,
                "1h",
                maxInterval / 60,
                false,
                candlesticks[candlesticks.length - 1].startTime
            );

        }else{

            candlesticks = this.candlesticks;
            candlesticks_15m = this.candlesticks_1h;

        }

        // Список правил дл япостроения зон
        let zoneRulesBB = getBBRulesIndexes();

        for (let index = 0; index < zoneRulesBB.length; index++) {

            const element = zoneRulesBB[index];
            const rule = getBBRuleByIddex(element);


            if (rule.intervals > 1440) {

                console.log('ExchangeData: 98: RuleIntervals', rule.intervals);
                candlesticks_1h = CalcBollingerComplex(rule, candlesticks_1h);
        
                // Зоны
                candlesticks_1h = CalcZonesByBB(
                  rule,
                  candlesticks_1h,
                  candlesticks[candlesticks.length - 1].close
                );
        
                // Предыдущая зона
                candlesticks_1h = CalcPrevZone(rule, candlesticks_1h);

            } else {
                // Просчитываем цены границ отклонений для каждой свечи
                candlesticks = CalcBollingerComplex(rule, candlesticks);
        
                // Зоны
                candlesticks = CalcZonesByBB(rule, candlesticks);
        
                // Предыдущая зона
                candlesticks = CalcPrevZone(rule, candlesticks);
            }

        }

        this.candlesticks = candlesticks;

        this.candlesticks_1h = candlesticks_1h;

        


        // Тут мы сращиваем данные 1м с 15м
        this.candlesticks = compareCandlesticks(
            this.candlesticks,
            this.candlesticks_1h,
            true
        );

        
        this.startTicker();

        
        if(config.simulate){
            simulateEventer.emit('callNextCandle', this.candlesticks[this.candlesticks.length-1])
        }

        return this.subscribeNext();

    }


    startTicker() {

        // Запускаем тикер и подписываемся на обновления
        let ticketClass = new TickerClass(this.pair, this.tradingTimeframes);
    
        let ticketClassSimulate = new TickerClassSimulate(
          this.pair,
          this.tradingTimeframes
        );        
    
        if (!config.simulate) {
          ticketClass.initializingSubscribtion().subscribe((e) => {
            if (Object.keys(e).includes("1m")) {
              setTimeout(() => {
                this.klinesHandler(e);
              }, 500);
            } else {
              this.candlesticks_1h.push(e);
            }
          });
        } else {

            
          
          ticketClassSimulate.initializingSubscribtion().subscribe(async (e) => {
            // Если свеча часовая
            
            if (e["1m"].startTime % 3600000 == 0) {
              console.log("Add 1 Hour".green);
              console.log('initializingSubscribtion', e["1m"].startTime);

              
    
              this.candlesticks_1h.push(e["1m"]);
              console.log(this.candlesticks_1h[this.candlesticks_1h.length-1], this.candlesticks_1h[this.candlesticks_1h.length-2])
              this.candlesticks_1h.shift();
              if (this.startHourDate === undefined) {
                this.startHourDate = new Date();
              } else {                
                this.startHourDate = new Date();
              }
            }
    
            this.candlesticks.shift();
    
            await this.klinesHandler(e);
          });
        }
    
        
      }




      // Обработчик новых свечей
  async klinesHandler(klines) {
    //return;

    let intervals = Object.keys(klines);

    

    

    for (let index = 0; index < intervals.length; index++) {
      const element = intervals[index];

      let kline = klines[element];

      // Список правил дл япостроения зон
      let zoneRulesBB = getBBRulesIndexes();

      let candlesticks = [...this.candlesticks, kline];

      let candlesticks_1h = [...this.candlesticks_1h];

      let calculateHour = false;

      

      if (
        this.candlesticks_1h[this.candlesticks_1h.length - 1].startTime !=
        this.lastHour
      ) {
        calculateHour = true;
        this.lastHour =
          this.candlesticks_1h[this.candlesticks_1h.length - 1].startTime;
      }

      

      for (let index = 0; index < zoneRulesBB.length; index++) {
        const element = zoneRulesBB[index];
        const rule = getBBRuleByIddex(element);

        if (rule.intervals > 1440) {
          if (calculateHour) {
            candlesticks_1h = CalcBollingerComplex(
              rule,
              candlesticks_1h,
              true
            );

            // Зоны
            candlesticks_1h = CalcZonesByBB(
              rule,
              candlesticks_1h,
              candlesticks[candlesticks.length - 1].close,
              true
            );

            // Предыдущая зона
            candlesticks_1h = CalcPrevZone(rule, candlesticks_1h, true);
          }
        } else {
          

          // Просчитываем цены границ отклонений для каждой свечи
          candlesticks = CalcBollingerComplex(rule, candlesticks, true);



          

          

          
          // Зоны
          candlesticks = CalcZonesByBB(rule, candlesticks);

          

          

          
          // Предыдущая зона
          candlesticks = CalcPrevZone(rule, candlesticks);

          

          
        }
      }

      // Сращиваем 1ч и 1м
      candlesticks = compareCandlesticks(candlesticks, candlesticks_1h, true);
      

      this.candlesticks_1h = candlesticks_1h
      this.candlesticks.push(candlesticks[candlesticks.length - 1]);
    }

    
    this.throwNextCandle.emit('next', this.candlesticks[this.candlesticks.length-1])

    

    
    

    

    
    
  }



}