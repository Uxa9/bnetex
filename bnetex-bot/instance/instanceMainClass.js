const TickerClass = require("./tickerClass");
const calcMA = require("./utils/calcMA");
const calcMMBS = require("./utils/calcMMBS");
const getPairDataFromExchange = require("./utils/getPairDataFromExchange");
const { tradingPatternsChecker } = require("./utils/patterns/patternService");
const { checkPatternToOpen } = require("./utils/patterns/patternService");
const tickerHelper = require("./utils/tickerHelper");
const { convertKlines } = require("./utils/tickerHelper");
const timeframeRules = require("./utils/timeframeRules");
var colors = require("colors");
const patternScheme = require("../instance/db/schemes/patterns");
const moment = require("moment");
const db = require("../instance/db/db");
const checkPositionsToClose = require("./utils/positions/checkPositionsToClose");
const getLastMinimalTimeframe = require("./utils/getLastMinimalTimeframe");

const getMinimalTimframeValueByCandlesticks = require("./utils/getMinimalTimframeValueByCandlesticks");
const firstPositiveCandleAfterBollinger = require("./utils/firstPositiveCandleAfterBollinger");
const patternSignalToAction = require("./utils/patterns/patternSignalToAction");
const buySignalHandler = require("./utils/positions/buySignalHandler");
const updateMinPriceOfPositions = require("./utils/positions/updateMinPriceOfPositions");
const { sendMessageToMainChanel } = require("./utils/telegram/tg");
const TelegramBotClass = require("./utils/telegram/bot");
const { tg } = require("./utils/telegram/axios");

const tgEvents = require('./utils/events').tgEvents

const { Observable } = require("rxjs");

const { Telegraf } = require("telegraf");
const binance = require("./utils/binance");
const {
  getMaxIntervals,
  getBBRulesIndexes,
  getBBRuleByIddex,
  getRulesMoreIntervals,
} = require("./utils/BollZoneRules");
const {
  CalcBollingerComplex,
} = require("./utils/strategy/CalcBollengerComplex");
const { CalcPrevZone } = require("./utils/strategy/CalcPrevZone");
const { CalcZonesByBB } = require("./utils/strategy/CalcZonesByBB");
const getPatterntMySQL = require("./db/sequelize/actions/patterns/getPatterntMySQL");
const checkPositionToCloseMySQL = require("./db/sequelize/actions/positions/checkPositionToCloseMySQL");
const compareCandlesticks = require("./utils/compareCandlesticks");
const { simulateEventer } = require("./utils/events");
const TickerClassSimulate = require("./tickeClassSimulate");
const ExchangeData = require("./classes/ExchangeData");
const PositionsModule = require("./classes/PositionsModule");
const AnalyzeModule = require("./classes/AnalyzeModules");
const DecisionsModule = require("./classes/DecisionsModule");

// Event Emmiter для симулятора

const config = require("../config/config")();

module.exports = class InstanceClass {
  constructor(pair) {



    this.pair = pair;

    this.exchangeData = new ExchangeData(this.pair)

    this.positionsData = new PositionsModule(this.pair)

    this.analyzeModule = new AnalyzeModule(this.pair);

    this.DecisionsModule = new DecisionsModule(this.pair);

    this.candlesticks = undefined;

    this.candlesticks_15m = undefined;

    this.tradingTimeframes = config.tradingTimeframes;
    

    //this.klinesHandler = this.klinesHandler.bind(this);

    this.waitingForFirstGreen = {
      pattern: undefined,
      wait: false,
    };

    this.tgClass = undefined;

    this.lastHour = undefined;

    this.startHourDate = undefined;
  }

  

  // Метод для оценки текущей ситуации
  async ProbabilityAction() {
    
    let lastKline = this.candlesticks[this.candlesticks.length - 1];

    let CLEAN__SIGNAL = firstPositiveCandleAfterBollinger(this.candlesticks);

    // Проверяем, может ли стоит уже закрыть позицию какую то
    await checkPositionToCloseMySQL(this.pair, lastKline);

    // Проверка АКТИВАЦИИ/ДЕАКТИВАЦИИ Паттернов
    await tradingPatternsChecker(lastKline, this.pair);

    let signalToOpen = await checkPatternToOpen(lastKline, this.pair, false);

    if (signalToOpen.signal) {      
      
      this.waitingForFirstGreen.pattern = signalToOpen.pattern;
      this.waitingForFirstGreen.wait = true;
      
    }

    // Если мы ждем первую зеленую и она первая, то не ждем
    if (this.waitingForFirstGreen.wait && CLEAN__SIGNAL) {      
      
      this.waitingForFirstGreen.wait = false;
      await buySignalHandler(
        this.waitingForFirstGreen.pattern,
        this.pair,
        lastKline
      );
    }

    
    
    tgEvents.emit('updateKline', lastKline);

    // Если симулятор. говорим об оконцамии обработки свечи
    if (config.simulate) {
      simulateEventer.emit(
        "callNextCandle",
        this.candlesticks[this.candlesticks.length - 1]
      );
    }

  }

  async initializing() {
    

    // Формирование данных с биржи
    this.exchangeData.initializing().then(subscribtion => {      

      subscribtion.subscribe(async (candlesData) => {        
        
        this.positionsData.updateLastKline(candlesData.last)

        // Updating TG BOT Actual Info
        tgEvents.emit('updateKline', candlesData.last);

        // Actual Position's Module | Trying to close actual positions      
        await this.positionsData.closePositions();

        // Updating actual market data for analyze module && Calling global analyze function
        let analyzeResult = await this.analyzeModule.updateMarketData(candlesData.last).analyze(); if(!analyzeResult) return;

        // Updating actual analyze Result in DesisionsModule && Calling function that decides whether to enter a position or average
        await this.DecisionsModule.updateAnalyzeResponse(analyzeResult, candlesData.last_100).decisionAction();

      })
    })
    
 
  }

  
};
