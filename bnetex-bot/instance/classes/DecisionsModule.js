const marketBuy = require("../utils/binance/marketBuy");
const {
  getBBRuleByIddex,
  getBBRulesIndexes,
} = require("../utils/BollZoneRules");
const StrategyRules = require("../utils/strategy/StrategyRules");
const AnalyzeModule = require("./AnalyzeModules");
const FuturesModule = require("./FuturesModule");
const PositionsModule = require("./PositionsModule");
const db = require("../db/sequelize/dbseq");

module.exports = class DecisionsModule {
  constructor(pair) {
    // Set trading pair
    this.pair = pair;

    // Set last 100 candles
    this.last_100 = undefined;

    this.analyzeResponseData = undefined;

    this.openedPatternToEnter = undefined;

    this.marketData = undefined;

    this.futuresModule = new FuturesModule(pair);
  }

  /**
   * Function updates actual market data by lastKline
   * @param {*} lastKline
   */
  updateMarketData(lastKline) {
    this.marketData = lastKline;

    return this;
  }

  /**
   * Function checks that pattern has canditions to open position right now
   */
  _checkPatternToOpen() {
    let patternsToOpen = [];

    
    if(!this.analyzeResponseData.Pattern) return null;

    let groups = this.analyzeResponseData.Pattern.ACTIVE_GROUPs;

    

    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];
      //console.log(element.ACTIVE_GROUP_TRIGGERs)

      let OpenTriggers = element.ACTIVE_GROUP_TRIGGERs.filter((i) => i.type == "OPEN");

      let patternCompare = StrategyRules(
        this.marketData,
        OpenTriggers,
        false,
        false
      );

      if (patternCompare) patternsToOpen.push(element);
    }
    
    

    if (patternsToOpen.length == 0) return null;

    return patternsToOpen.sort((a, b) => b.ProfitPercent - a.ProfitPercent)[0];
  }

  /**
   * Function updates actual analyzeResponse From analyzeModule
   * @param {*} analyzeResponse
   */
  updateAnalyzeResponse(analyzeResponse, last_100) {
    this.analyzeResponseData = analyzeResponse;

    this.last_100 = last_100;
    return this;
  }

  /**
   * Function searchs first green candle in bollinger out
   */
  _firstPositiveCandle() {
    let candles = this.last_100;

    // Надо определить, подходит ли текущая точка для входа без учета паттернов входа
    candles = candles.map((i) => {
      return {
        ...i,
        close: parseFloat(i.close),
        open: parseFloat(i.open),
      };
    });

    let lastCandle = candles[candles.length - 1];

    // Если свеча медвежья - сразу нет
    if (lastCandle.open > lastCandle.close) return false;

    // Смотрим дальше
    // Листаем в обратном порядке, если до ББ нет ни одной зеленой - сигнал на покупку
    candles = candles.sort((a, b) => b.startTime - a.startTime);

    let signal = false;

    for (let index = 1; index < candles.length; index++) {
      const element = candles[index];

      if (element.close > element.open) break;

      signal = true;
    }

    return signal;
  }

  async _updatePositionInDb(qty, enterPrice, ACTIVE_GROUP, deposit, marketBuy = false, enterStep = 1) {

    let margin = parseFloat((enterPrice * qty) / 10).toFixed(2);

    let ActualPositionsModule = new PositionsModule(this.pair);

    let ActialPosition = await ActualPositionsModule.getActualPositions();

    if (!ActialPosition) {
      // Создаем позицию
      ActualPositionsModule.createPosition(
        margin,
        enterPrice,
        qty,
        ACTIVE_GROUP,
        deposit
      );
    }else{
      await ActualPositionsModule.updatePosition(ActialPosition, marketBuy, ACTIVE_GROUP, enterStep);
    }
  }

  async _averagePositionByCurrentRule(ActialPosition) {

    if(!ActialPosition) return {code: 'NON_ACTION'};

    // Количество входов по текущей активной группу
    let currentPatternEntersCount = ActialPosition.POSITION_ENTERs.filter(
      (i) => i.ACTIVEGROUPId == ActialPosition.ACTIVEGROUPId
    ).length;

    

    // Все правила входа по текущей активной группе
    let actualActiveGroupEnterRules =
      ActialPosition.ACTIVE_GROUP.POSITION_RULEs;

    // Оставшееся количество входов по текущей группе
    let lostEntersCountActualGroups =
      actualActiveGroupEnterRules.length - currentPatternEntersCount;

      //console.log({currentPatternEntersCount, actualActiveGroupEnterRules, lostEntersCountActualGroups})

    if(lostEntersCountActualGroups == 0) return {code: 'NON_ACTION'};

    let lastPrice = parseFloat(this.marketData.close);

    let currentDiffOfAverage = Math.abs(
      100 - (lastPrice * 100) / ActialPosition.averagePrice
    );

    //return {code: 'NON_ACTION'}
      
    let activeFirstRule = getRuleByIndex(
      ActialPosition.ACTIVE_GROUP.POSITION_RULEs,
      currentPatternEntersCount + 1
    );

    //console.log(activeFirstRule)

    if(!activeFirstRule) {
      console.log('Нехуй нахуй')
      return {code: 'NON_ACTION'};
    }

    

    let totalPartsOfPositions = getTotalParts(ActialPosition.ACTIVE_GROUP.POSITION_RULEs);

    let PERCENT_OF_DEPOSIT = ActialPosition.ACTIVE_GROUP.PATTERN.PERCENT_OF_DEPOSIT

    let PatternTradingVolume = PERCENT_OF_DEPOSIT * ActialPosition.deposit / 100;

    //console.log({PatternTradingVolume})

    let PartsForPatterns = await this._getPartsInWorkingGroup(ActialPosition.ACTIVE_GROUP.PATTERN.WORKING_GROUP);
    
    //console.log({PartsForPatterns})

    let patternTradingVolume =
      PatternTradingVolume /
      PartsForPatterns;

    let singlePart = patternTradingVolume / totalPartsOfPositions;

    let enterRuleVolume = Math.floor(singlePart * activeFirstRule.depositPart);

    let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);
    
    
    
    if(currentDiffOfAverage >= activeFirstRule.priceDifferencePercent){

        try {
          let marketBuy = await this.futuresModule.marketBuy(qty);
          console.log({marketBuy})
          if (marketBuy.orderId) {
            console.log("Позиция куплена, записываем в БД");
            this._updatePositionInDb(
              qty,
              lastPrice,
              this.openedPatternToEnter.id,
              ActialPosition.deposit,
              marketBuy,
              currentPatternEntersCount + 1
            );
            return {code: 'AVERAGE_BY_CURRENT_CONDITION'};
          }

        } catch (e) {
          console.log(e);
        }  


        

        
    }

    return {code: 'NON_ACTION'};


    
  }

  async _getPartsInWorkingGroup(WORKING_GROUP) {

    let all = await db.models.Pattern.findAll({where: {
      WORKING_GROUP
    }})

    if(all.length == 0) return 0;

    return all.reduce((prev, curr) => prev + curr.PART_OF_VOLUME, 0)    

  }

  /**
   * The function decides whether to enter a position or average
   * return value of completed action - AVERAGE_BY_NEW_CONTIDION | AVERAGE_BY_CURRENT_CONDITION | CREATE_NEW_POSITION | NON_ACTION
   */
  async decisionAction() {

    
    // Actual Positions Module
    let ActualPositionsModule = new PositionsModule(this.pair);

    // Find actual positions to average
    let ActialPosition = await ActualPositionsModule.getActualPositions();

    

    // if (this.analyzeResponseData.CODE === "ACTUAL" && !ActialPosition) {
    //   console.log("Ни позиции ни хуиции");
    // }

    

    //console.log(this.analyzeResponseData)

    let lastPrice = parseFloat(this.marketData.close);

    // Checking if Pattern allow entry into position
    let _openedPattern = this._checkPatternToOpen();

    
    
    // Если вообще нет открытого - меняем нахуй
    if (!this.openedPatternToEnter && _openedPattern) {
      this.openedPatternToEnter = _openedPattern;
    } else if (!this.openedPatternToEnter && _openedPattern) {
      // Если есть открытый, то дополнительно проверяем новый на профит

      if (
        this.openedPatternToEnter.ProfitPercent < _openedPattern.ProfitPercent
      ) {
        this.openedPatternToEnter = _openedPattern;
      }
    }

    

    // Clean Signal - First positive Candle after green
    let CLEAN__SIGNAL = this._firstPositiveCandle();

    

    if(!CLEAN__SIGNAL) return { code: 'NON_ACTION' }

    if(ActialPosition && ActialPosition.averagePrice < lastPrice) return {code: 'NON_ACTION'}

    
    // Here
    if (ActialPosition) {
      /**
       * Если есть активные позции, надо определить - соответствует ли текущий активный паттернт минимальному отступу от средней цены
       * If There are active position - determine matching offset of current active pattern from avegare price
       * Если соотстветствует - дождаться первой зеленой и докупить
       * If offset is matched - waiting of first green candle and buy
       */
      if (!this.openedPatternToEnter) {
        console.log("Чисто на усреднение проверяем");
        // Чисто на устреднение
        return { code: "NON_ACTION" };
      }

      console.log("Да у нас есть позиция, и с ней надо что то делать");

      // Ничего не делаем, позиция в плюсе
      // TODO: UNCOMMENT FOR PROD
      // if(ActialPosition.averagePrice < lastPrice) return { code: 'NON_ACTION' }
      
      console.log(this.openedPatternToEnter.id, ActialPosition.ACTIVEGROUPId)

      if (this.openedPatternToEnter.id != ActialPosition.ACTIVEGROUPId) {
        // К нам пришел новый паттерн

        console.log(this.analyzeResponseData.CurrentTradingVolume, ActialPosition.deposit)
        if (
          this.analyzeResponseData.CurrentTradingVolume >= ActialPosition.deposit
        ) {
          // Проверяем условия для усреднения и усредняемся с новой позицией
          let activeFirstRule = getRuleByIndex(
            this.openedPatternToEnter.POSITION_RULEs,
            1
          );

          let currentDiffOfAverage = Math.abs(
            100 - (lastPrice * 100) / ActialPosition.averagePrice
          );

          if (currentDiffOfAverage >= activeFirstRule.priceDifferencePercent) {

            let PERCENT_OF_DEPOSIT = this.analyzeResponseData.Pattern.PERCENT_OF_DEPOSIT

            let PatternTradingVolume = PERCENT_OF_DEPOSIT * this.analyzeResponseData.CurrentTradingVolume / 100;

            let patternTradingVolume =
              PatternTradingVolume /
              this.analyzeResponseData.PartsForPatterns;

            let totalPartsOfPositions = getTotalParts(
              this.openedPatternToEnter.POSITION_RULEs
            );

            let singlePart = patternTradingVolume / totalPartsOfPositions;

            let enterRuleVolume = Math.floor(
              singlePart * activeFirstRule.depositPart
            );

            let lastPrice = parseFloat(this.marketData.close);

            let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

            try {
              let marketBuy = await this.futuresModule.marketBuy(qty);

              if (marketBuy.orderId) {
                console.log("Позиция куплена, записываем в БД");
                this._updatePositionInDb(
                  qty,
                  lastPrice,
                  this.openedPatternToEnter.id,
                  this.analyzeResponseData.CurrentTradingVolume,
                  marketBuy,
                  1
                );
              }
            } catch (e) {
              console.log(e);
            }
          }
        } else {
          return await this._averagePositionByCurrentRule(ActialPosition);
        }
      } else {
        return await this._averagePositionByCurrentRule(ActialPosition);
      }

      //console.log(ActialPosition.ACTIVE_GROUP)

      //console.log(ActialPosition.ACTIVE_GROUP.PATTERN);

      let activeFirstRule = getRuleByIndex(
        this.openedPatternToEnter.POSITION_RULEs,
        1
      );

      let currentDiffOfAverage = Math.abs(
        100 - (lastPrice * 100) / ActialPosition.averagePrice
      );

      if (currentDiffOfAverage >= activeFirstRule.priceDifferencePercent) {
        console.log("Заебись, можно усредняться");
      }
    } else if (_openedPattern) {
      console.log("Просто выполняем покупку и все нахуй");

      let firstRule = getRuleByIndex(_openedPattern.POSITION_RULEs, 1);

      let totalPartsOfPositions = getTotalParts(_openedPattern.POSITION_RULEs);

      let PERCENT_OF_DEPOSIT = this.analyzeResponseData.Pattern.PERCENT_OF_DEPOSIT

      let PatternTradingVolume = PERCENT_OF_DEPOSIT * this.analyzeResponseData.CurrentTradingVolume / 100;

      console.log({PatternTradingVolume})

      let patternTradingVolume =
        PatternTradingVolume /
        this.analyzeResponseData.PartsForPatterns;

      let singlePart = patternTradingVolume / totalPartsOfPositions;

      let enterRuleVolume = Math.floor(singlePart * firstRule.depositPart);

      let lastPrice = parseFloat(this.marketData.close);

      let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

      console.log({ qty });

      try {
        let marketBuy = await this.futuresModule.marketBuy(qty);

        if (marketBuy.orderId) {
          console.log("Позиция куплена, записываем в БД");
          this._updatePositionInDb(
            qty,
            lastPrice,
            _openedPattern.id,
            this.analyzeResponseData.CurrentTradingVolume
          );
        }
      } catch (e) {
        console.log(e);
      }

      return {
        code: "CREATE_NEW_POSITION",
      };
    }

    //console.log(this.analyzeResponseData)

    //console.log({CLEAN__SIGNAL, OP: this.openedPatternToEnter})

    return {
      code: "NON_ACTION",
    };
  }
};

const getRuleByIndex = (RULEs, index) => {
  return RULEs.sort((a, b) => b.positionIndex - a.positionIndex)[index - 1];
};

const getTotalParts = (RULEs) => {
  return RULEs.reduce((prev, curr) => prev + curr.depositPart, 0);
};

const groupByRules = (ACTIVE_GROUP_TRIGGERs) => {
  let zoneRulesBB = getBBRulesIndexes();

  let rules = zoneRulesBB.map((i) => getBBRuleByIddex(i));

  let grouppedTriggers = rules.map((i) =>
    ACTIVE_GROUP_TRIGGERs.filter(
      (j) => j.sigma == i.sigma && j.intervals == i.intervals
    )
  );

  return grouppedTriggers.filter((i) => i.length > 0);
};
