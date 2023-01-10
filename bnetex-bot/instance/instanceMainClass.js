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

// Event Emmiter для симулятора

const config = require("../config/config")();

module.exports = class InstanceClass {
  constructor(pair) {
    this.pair = pair;

    this.candlesticks = undefined;

    this.candlesticks_15m = undefined;

    this.tradingTimeframes = config.tradingTimeframes;

    this.klinesHandler = this.klinesHandler.bind(this);

    this.waitingForFirstGreen = {
      pattern: undefined,
      wait: false,
    };

    this.tgClass = undefined;

    this.lastHour = undefined;

    this.startHourDate = undefined;
  }

  // Обработчик новых свечей
  async klinesHandler(klines) {
    //return;

    let intervals = Object.keys(klines);

    console.log("----------------------------------------");

    let CalcBollingerComplexTime = 0;
    let CalcZonesByBBTime = 0;
    let CalcPrevZoneTime = 0;

    let iteration = 0;

    for (let index = 0; index < intervals.length; index++) {
      const element = intervals[index];

      let kline = klines[element];

      // Список правил дл япостроения зон
      let zoneRulesBB = getBBRulesIndexes();

      let candlesticks = [...this.candlesticks, kline];

      let candlesticks_15m = [...this.candlesticks_15m];

      let calculateHour = false;

      //console.log(this.candlesticks_15m[this.candlesticks_15m.length-1].startTime != this.lastHour)

      if (
        this.candlesticks_15m[this.candlesticks_15m.length - 1].startTime !=
        this.lastHour
      ) {
        calculateHour = true;
        this.lastHour =
          this.candlesticks_15m[this.candlesticks_15m.length - 1].startTime;
      }

      //console.log({calculateHour})

      for (let index = 0; index < zoneRulesBB.length; index++) {
        const element = zoneRulesBB[index];
        const rule = getBBRuleByIddex(element);

        if (rule.intervals > 1440) {
          if (calculateHour) {
            candlesticks_15m = CalcBollingerComplex(
              rule,
              candlesticks_15m,
              true
            );

            // Зоны
            candlesticks_15m = CalcZonesByBB(
              rule,
              candlesticks_15m,
              candlesticks[candlesticks.length - 1].close,
              true
            );

            // Предыдущая зона
            candlesticks_15m = CalcPrevZone(rule, candlesticks_15m, true);
          }
        } else {
          let adate = new Date();

          // Просчитываем цены границ отклонений для каждой свечи
          candlesticks = CalcBollingerComplex(rule, candlesticks, true);

          let bdate = new Date();

          CalcBollingerComplexTime += (bdate - adate) / 1000;

          iteration++;

          adate = new Date();
          // Зоны
          candlesticks = CalcZonesByBB(rule, candlesticks);

          bdate = new Date();

          CalcZonesByBBTime += (bdate - adate) / 1000;

          adate = new Date();
          // Предыдущая зона
          candlesticks = CalcPrevZone(rule, candlesticks);

          bdate = new Date();

          CalcPrevZoneTime += (bdate - adate) / 1000;
        }
      }

      // Сращиваем 1ч и 1м
      candlesticks = compareCandlesticks(candlesticks, candlesticks_15m, true);
      //console.log(Object.keys(candlesticks_15m[candlesticks_15m.length-1]))

      this.candlesticks_15m = candlesticks_15m;
      this.candlesticks.push(candlesticks[candlesticks.length - 1]);
    }

    //console.log('Times \b'.red)

    //console.log({CalcBollingerComplexTime, CalcPrevZoneTime, CalcZonesByBBTime, iteration})

    //console.log({allTime: CalcBollingerComplexTime + CalcPrevZoneTime + CalcZonesByBBTime})

    await this.ProbabilityAction();
    //simulateEventer.emit('callNextCandle', this.candlesticks[this.candlesticks.length-1])
  }

  // Метод для оценки текущей ситуации
  async ProbabilityAction() {
    //console.log('Decide to trade');

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

    // Если симулятор. говорим об оконцамии обработки свечи
    if (config.simulate) {
      simulateEventer.emit(
        "callNextCandle",
        this.candlesticks[this.candlesticks.length - 1]
      );
    }

  }

  async initializing(startTicker = true) {
    console.log(`Initializing trading pair: ${this.pair}`);

    // Получаем максимальное количество интервалов
    let maxInterval = getMaxIntervals() * 2;

    // Весь просчет по новой стратегии идет по 1m
    // Максимальное количество нужных свечей
    let candlesticks = [];

    // Свечи 30м для просчета давних отклонений
    let candlesticks_15m = [];

    if (this.candlesticks == undefined || !this.candlesticks) {
      // Для минутки оптимальное количество 4320
      candlesticks = await getPairDataFromExchange(this.pair, "1m", 2880);

      // Все остальное запихиваем в 30м
      candlesticks_15m = await getPairDataFromExchange(
        this.pair,
        "1h",
        maxInterval / 60,
        false,
        candlesticks[candlesticks.length - 1].startTime
      );

      this.lastHour = candlesticks_15m[candlesticks_15m.length - 1].startTime;
    } else {
      candlesticks = this.candlesticks;
      candlesticks_15m = this.candlesticks_15m;
    }

    // Список правил дл япостроения зон
    let zoneRulesBB = getBBRulesIndexes();

    for (let index = 0; index < zoneRulesBB.length; index++) {
      const element = zoneRulesBB[index];
      const rule = getBBRuleByIddex(element);

      if (rule.intervals > 1440) {
        candlesticks_15m = CalcBollingerComplex(rule, candlesticks_15m);

        // Зоны
        candlesticks_15m = CalcZonesByBB(
          rule,
          candlesticks_15m,
          candlesticks[candlesticks.length - 1].close
        );

        // Предыдущая зона
        candlesticks_15m = CalcPrevZone(rule, candlesticks_15m);
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

    this.candlesticks_15m = candlesticks_15m;

    // Тут мы сращиваем данные 1м с 15м
    this.candlesticks = compareCandlesticks(
      this.candlesticks,
      this.candlesticks_15m,
      true
    );

    if (startTicker) {
      this.startTicker();
    }

    simulateEventer.emit(
      "callNextCandle",
      this.candlesticks[this.candlesticks.length - 1]
    );
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
          this.candlesticks_15m.push(e);
        }
      });
    } else {
      
      ticketClassSimulate.initializingSubscribtion().subscribe(async (e) => {
        // Если свеча часовая

        if (e["1m"].startTime % 3600000 == 0) {
          console.log("Add 1 Hour".green);

          this.candlesticks_15m.push(e["1m"]);
          this.candlesticks_15m.shift();
          if (this.startHourDate === undefined) {
            this.startHourDate = new Date();
          } else {
            let bdate = new Date();            
            this.startHourDate = new Date();
          }
        }

        this.candlesticks.shift();

        await this.klinesHandler(e);
      });
    }

    if (config.initTelgram) {
      this.tgClass = new TelegramBotClass(config.tgBotKey, this.candlesticks);
      this.tgClass.init();
    }
  }
};
