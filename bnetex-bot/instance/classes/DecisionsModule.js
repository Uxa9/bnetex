const {
  getBBRuleByIddex,
  getBBRulesIndexes,
} = require("../utils/BollZoneRules");
const StrategyRules = require("../utils/strategy/StrategyRules");
const AnalyzeModule = require("./AnalyzeModules");
const FuturesModule = require("./FuturesModule");
const PositionsModule = require("./PositionsModule");
const db = require("../db/sequelize/dbseq");
const { Op } = require("sequelize");

module.exports = class DecisionsModule {
  constructor(pair, positionsData) {
    // Set trading pair
    this.pair = pair;

    // Set last 100 candles
    this.last_100 = undefined;

    this.analyzeResponseData = undefined;

    this.openedPatternToEnter = undefined;

    this.marketData = undefined;

    this.wailtToResetOpennedPattern = false;

    this.futuresModule = new FuturesModule(pair, positionsData);
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

    if(this.marketData.startTime > 1675987200000){
      console.log(this.analyzeResponseData)
    }

    if (!this.analyzeResponseData.Pattern) return null;

    let groups = this.analyzeResponseData.Pattern.ACTIVE_GROUPs;

    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];

      let OpenTriggers = element.ACTIVE_GROUP_TRIGGERs.filter(
        (i) => i.type == "OPEN"
      );

      let patternCompare = StrategyRules(
        this.marketData,
        OpenTriggers,
        false,
        this.marketData.startTime == 1680486240000
      );

      if (patternCompare) patternsToOpen.push(element);
    }

    if (this.marketData.startTime == 1680486240000) {
      console.log("---------------");
      console.log(this.analyzeResponseData);
      console.log("---------------");
      console.log(groups);
      console.log("---------------");
      console.log(patternsToOpen);
      //process.exit();
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

  async _updatePositionInDb(
    qty,
    enterPrice,
    ACTIVE_GROUP,
    deposit,
    marketBuy = false,
    enterStep = 1,
    unixtime = 0
  ) {
    let margin = parseFloat((enterPrice * qty) / 10).toFixed(2);

    let ActualPositionsModule = new PositionsModule(this.pair);

    let ActialPosition = await ActualPositionsModule.getActualPositions();
    ActualPositionsModule.updateLastKline(this.marketData);

    if (!ActialPosition) {
      // Вырубаем все паттерны кроме текущего,  когда создали позицию
      try {
        await db.models.Pattern.update(
          { status: false },
          {
            where: {
              WORKING_GROUP: {
                [Op.not]: this.analyzeResponseData.Pattern.WORKING_GROUP,
              },
            },
          }
        );
      } catch (e) {
        console.log(e);
      }

      // Создаем позицию
      await ActualPositionsModule.createPosition(
        margin,
        enterPrice,
        qty,
        ACTIVE_GROUP,
        deposit,
        unixtime,
        this.analyzeResponseData.TotalTradingVolume,
        this.analyzeResponseData.CurrentTradingVolume
      );
    } else {
      await ActualPositionsModule.updatePosition(
        ActialPosition,
        marketBuy,
        ACTIVE_GROUP,
        enterStep,
        enterPrice,
        deposit,
        this.analyzeResponseData.CurrentTradingVolume
      );
    }
  }

  async _averagePositionByCurrentRule(ActialPosition) {
    if (!ActialPosition) return { code: "NON_ACTION" };

    // Количество входов по текущей активной группу
    let currentPatternEntersCount = ActialPosition.POSITION_ENTERs.filter(
      (i) => i.ACTIVEGROUPId == ActialPosition.ACTIVEGROUPId && i.tradingVolume == this.analyzeResponseData.CurrentTradingVolume
    ).length;

    // Все правила входа по текущей активной группе
    let actualActiveGroupEnterRules =
      ActialPosition.ACTIVE_GROUP.POSITION_RULEs;

    // Оставшееся количество входов по текущей группе
    let lostEntersCountActualGroups =
      actualActiveGroupEnterRules.length - currentPatternEntersCount;

    if (lostEntersCountActualGroups == 0) return { code: "NON_ACTION" };

    let lastPrice = parseFloat(this.marketData.close);

    let currentDiffOfAverage =
      (lastPrice * 100) / ActialPosition.lastEnterPrice - 100;

    let POSITION_INDEX = currentPatternEntersCount + 1;

    let minusDiff = currentDiffOfAverage < 0;

    /**
     * 
      let activeFirstRule = getRuleByIndex(
        this.openedPatternToEnter.POSITION_RULEs,
        POSITION_INDEX
      );

      

            

      if ((Math.abs(currentDiffOfAverage) >= activeFirstRule.priceDifferencePercent && minusDiff) || activeFirstRule.priceDifferencePercent == 0) {
     */

    let activeFirstRule = getRuleByIndex(
      ActialPosition.ACTIVE_GROUP.POSITION_RULEs,
      POSITION_INDEX
    );

    if (!activeFirstRule) return { code: "NON_ACTION" };

    let totalPartsOfPositions = getTotalParts(
      ActialPosition.ACTIVE_GROUP.POSITION_RULEs
    );

    let PERCENT_OF_DEPOSIT =
      ActialPosition.ACTIVE_GROUP.PATTERN.PERCENT_OF_DEPOSIT;

    let PatternTradingVolume =
      (PERCENT_OF_DEPOSIT * ActialPosition.deposit) / 100;

    // Сумма частей обьема рабочей группы
    let PartsForPatterns = await this._getPartsInWorkingGroup(
      ActialPosition.ACTIVE_GROUP.PATTERN.WORKING_GROUP
    );

    // Обьем депозита для текущего паттерна
    let patternTradingVolume = PatternTradingVolume / PartsForPatterns;

    // Единица обьема
    let singlePart =
      (patternTradingVolume / totalPartsOfPositions) *
      this.analyzeResponseData.Pattern.PART_OF_VOLUME;

    // Обьем для текущего входа
    let enterRuleVolume = Math.floor(singlePart * activeFirstRule.depositPart);

    // Объем в активе
    let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

    console.log({
      currentDiffOfAverage,
      AFPDP: activeFirstRule.priceDifferencePercent,
      minusDiff,
      OPID: this.openedPatternToEnter.id,
      currentPatternEntersCount,
      RULES: ActialPosition.ACTIVE_GROUP.POSITION_RULEs.map(
        (i) => i.positionIndex
      ),
      POSITION_INDEX,
    });

    if (
      (Math.abs(currentDiffOfAverage) >=
        activeFirstRule.priceDifferencePercent &&
        minusDiff) ||
      activeFirstRule.priceDifferencePercent == 0
    ) {
      try {
        let marketBuy = await this.futuresModule.marketBuy(
          qty,
          parseFloat(this.marketData.close)
        );

        if (marketBuy.orderId) {
          this._updatePositionInDb(
            qty,
            lastPrice,
            this.openedPatternToEnter.id,
            ActialPosition.deposit,
            marketBuy,
            currentPatternEntersCount + 1,
            this.marketData.startTime
          );
          return { code: "AVERAGE_BY_CURRENT_CONDITION" };
        }
      } catch (e) {
        console.log(e);
      }
    }

    return { code: "NON_ACTION" };
  }

  async _getPartsInWorkingGroup(WORKING_GROUP) {
    let all = await db.models.Pattern.findAll({
      where: {
        WORKING_GROUP,
      },
    });

    if (all.length == 0) return 0;

    return all.reduce((prev, curr) => prev + curr.PART_OF_VOLUME, 0);
  }

  /**
   * The function decides whether to enter a position or average
   * return value of completed action - AVERAGE_BY_NEW_CONTIDION | AVERAGE_BY_CURRENT_CONDITION | CREATE_NEW_POSITION | NON_ACTION
   */
  async decisionAction() {
    if (this.wailtToResetOpennedPattern) {
      this.openedPatternToEnter = undefined;
      this.wailtToResetOpennedPattern = false;
    }

    // Actual Positions Module
    let ActualPositionsModule = new PositionsModule(this.pair);

    // Find actual positions to average
    let ActialPosition = await ActualPositionsModule.getActualPositions();

    ActualPositionsModule.updateLastKline(this.marketData);

    let lastPrice = parseFloat(this.marketData.close);

    // Checking if Pattern allow entry into position
    let _openedPattern = this._checkPatternToOpen();

    // Если вообще нет открытого - меняем нахуй
    if (!this.openedPatternToEnter && _openedPattern) {
      this.openedPatternToEnter = _openedPattern;
    } else if (
      this.openedPatternToEnter &&
      _openedPattern &&
      _openedPattern.id != this.openedPatternToEnter.id
    ) {
      // Если есть открытый, то дополнительно проверяем новый на профит
      if (
        this.openedPatternToEnter.ProfitPercent <= _openedPattern.ProfitPercent
      ) {
        this.openedPatternToEnter = _openedPattern;
      }
    }

    // Clean Signal - First positive Candle after green
    let CLEAN__SIGNAL = this._firstPositiveCandle();

    if (CLEAN__SIGNAL) {
      this.wailtToResetOpennedPattern = true;
    }

    if (!CLEAN__SIGNAL) return { code: "NON_ACTION" };

    // TODO - Убрать условие
    // if (ActialPosition && ActialPosition.averagePrice < lastPrice)
    //   return { code: "NON_ACTION" };

    // Here
    if (ActialPosition) {
      /**
       * Если есть активные позции, надо определить - соответствует ли текущий активный паттернт минимальному отступу от средней цены
       * If There are active position - determine matching offset of current active pattern from avegare price
       * Если соотстветствует - дождаться первой зеленой и докупить
       * If offset is matched - waiting of first green candle and buy
       */
      if (!this.openedPatternToEnter) {
        // Чисто на устреднение
        return { code: "NON_ACTION" };
      }

      // Ничего не делаем, позиция в плюсе

      //if(ActialPosition.averagePrice < lastPrice) return { code: 'NON_ACTION' }

      if (this.openedPatternToEnter.id != ActialPosition.ACTIVEGROUPId) {
        // К нам пришел новый паттерн
        if (
          this.analyzeResponseData.CurrentTradingVolume >=
          ActialPosition.deposit
        ) {
          let POSITION_INDEX = 1;
          // Проверяем условия для усреднения и усредняемся с новой позицией
          let activeFirstRule = getRuleByIndex(
            this.openedPatternToEnter.POSITION_RULEs,
            POSITION_INDEX
          );

          let currentDiffOfAverage =
            (lastPrice * 100) / ActialPosition.lastEnterPrice - 100;

          let minusDiff = currentDiffOfAverage < 0;
          console.log({
            currentDiffOfAverage,
            AFPDP: activeFirstRule.priceDifferencePercent,
            minusDiff,
            OPID: this.openedPatternToEnter.id,
          });
          if (
            (Math.abs(currentDiffOfAverage) >=
              activeFirstRule.priceDifferencePercent &&
              minusDiff) ||
            activeFirstRule.priceDifferencePercent == 0
          ) {
            let PERCENT_OF_DEPOSIT =
              this.analyzeResponseData.Pattern.PERCENT_OF_DEPOSIT;

            let PatternTradingVolume =
              (PERCENT_OF_DEPOSIT *
                this.analyzeResponseData.CurrentTradingVolume) /
              100;

            let patternTradingVolume =
              PatternTradingVolume / this.analyzeResponseData.PartsForPatterns;

            let totalPartsOfPositions = getTotalParts(
              this.openedPatternToEnter.POSITION_RULEs
            );

            let singlePart =
              (patternTradingVolume / totalPartsOfPositions) *
              this.analyzeResponseData.Pattern.PART_OF_VOLUME;

            let enterRuleVolume = Math.floor(
              singlePart * activeFirstRule.depositPart
            );

            let lastPrice = parseFloat(this.marketData.close);

            let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

            try {
              let marketBuy = await this.futuresModule.marketBuy(
                qty,
                parseFloat(this.marketData.close)
              );

              if (marketBuy.orderId) {
                this._updatePositionInDb(
                  qty,
                  lastPrice,
                  this.openedPatternToEnter.id,
                  this.analyzeResponseData.CurrentTradingVolume,
                  marketBuy,
                  1,
                  this.marketData.startTime
                );
              }
            } catch (e) {
              console.log(e);
            }
          }
        } else {
          console.log('HERE 472')
          return await this._averagePositionByCurrentRule(ActialPosition);
        }
      } else {
        console.log('HERE 475')
        return await this._averagePositionByCurrentRule(ActialPosition);
      }

      let POSITION_INDEX = 1;
      let activeFirstRule = getRuleByIndex(
        this.openedPatternToEnter.POSITION_RULEs,
        POSITION_INDEX
      );

      let currentDiffOfAverage =
        (lastPrice * 100) / ActialPosition.lastEnterPrice - 100;

      let minusDiff = currentDiffOfAverage < 0;
      console.log({
        currentDiffOfAverage,
        AFPDP: activeFirstRule.priceDifferencePercent,
        minusDiff,
        OPID: this.openedPatternToEnter.id,
      });
      if (
        (Math.abs(currentDiffOfAverage) >=
          activeFirstRule.priceDifferencePercent &&
          minusDiff) ||
        activeFirstRule.priceDifferencePercent == 0
      ) {
        // // TODO - забыл тут
        // console.log("Заебись, можно усредняться");

        // let firstRule = getRuleByIndex(
        //   this.openedPatternToEnter.POSITION_RULEs,
        //   1
        // );

        // let totalPartsOfPositions = getTotalParts(
        //   this.openedPatternToEnter.POSITION_RULEs
        // );

        // let PERCENT_OF_DEPOSIT =
        //   this.analyzeResponseData.Pattern.PERCENT_OF_DEPOSIT;

        // let PatternTradingVolume =
        //   (PERCENT_OF_DEPOSIT * this.analyzeResponseData.CurrentTradingVolume) /
        //   100;

        // let patternTradingVolume =
        //   PatternTradingVolume / this.analyzeResponseData.PartsForPatterns;

        // let singlePart =
        //   (patternTradingVolume / totalPartsOfPositions) *
        //   this.analyzeResponseData.Pattern.PART_OF_VOLUME;

        // let enterRuleVolume = Math.floor(singlePart * firstRule.depositPart);

        // let lastPrice = parseFloat(this.marketData.close);

        // let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

        // try {
        //   let marketBuy = await this.futuresModule.marketBuy(qty, lastPrice);

        //   if (marketBuy.orderId) {
        //     this._updatePositionInDb(
        //       qty,
        //       lastPrice,
        //       this.openedPatternToEnter.id,
        //       this.analyzeResponseData.CurrentTradingVolume,
        //       marketBuy,
        //       1,
        //       this.marketData.startTime
        //     );
        //   }
        // } catch (e) {
        //   console.log(e);
        // }

        // return {
        //   code: "CREATE_NEW_POSITION",
        // };
      }
    } else if (this.openedPatternToEnter) {
      let firstRule = getRuleByIndex(
        this.openedPatternToEnter.POSITION_RULEs,
        1
      );

      let totalPartsOfPositions = getTotalParts(
        this.openedPatternToEnter.POSITION_RULEs
      );

      let PERCENT_OF_DEPOSIT =
        this.analyzeResponseData.Pattern.PERCENT_OF_DEPOSIT;

      let PatternTradingVolume =
        (PERCENT_OF_DEPOSIT * this.analyzeResponseData.CurrentTradingVolume) /
        100;

      let patternTradingVolume =
        PatternTradingVolume / this.analyzeResponseData.PartsForPatterns;

      let singlePart =
        (patternTradingVolume / totalPartsOfPositions) *
        this.analyzeResponseData.Pattern.PART_OF_VOLUME;

      let enterRuleVolume = Math.floor(singlePart * firstRule.depositPart);

      let lastPrice = parseFloat(this.marketData.close);

      let qty = parseFloat((enterRuleVolume / lastPrice) * 10).toFixed(3);

      try {
        let marketBuy = await this.futuresModule.marketBuy(qty, lastPrice);

        if (marketBuy.orderId) {
          this._updatePositionInDb(
            qty,
            lastPrice,
            this.openedPatternToEnter.id,
            this.analyzeResponseData.CurrentTradingVolume,
            marketBuy,
            1,
            this.marketData.startTime
          );
        }
      } catch (e) {
        console.log(e);
      }

      return {
        code: "CREATE_NEW_POSITION",
      };
    }

    return {
      code: "NON_ACTION",
    };
  }
};

const getRuleByIndex = (RULEs, index) => {
  return RULEs.sort((a, b) => a.positionIndex - b.positionIndex)[index - 1];
};

const getTotalParts = (RULEs) => {
  return RULEs.reduce((prev, curr) => prev + curr.depositPart, 0);
};
