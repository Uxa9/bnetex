const PositionsModule = require("./PositionsModule");

module.exports = class DecisionsModule {
  constructor(pair) {
    // Set trading pair
    this.pair = pair;

    // Set last 100 candles
    this.last_100 = undefined;

    this.analyzeResponseData = undefined;


    this.openedPatternToEnter = undefined;

  }

  /**
   * Function checks that pattern has canditions to open position right now
   */
  _checkPatternToOpen(){
        return {
            depositPercent: 1
        }
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

  /**
   * The function decides whether to enter a position or average
   */
  async decisionAction() {

    
    // Actual Positions Module
    let ActualPositionsModule = new PositionsModule(this.pair);

    // Find actual positions to average
    let ActialPosition = await ActualPositionsModule.getActualPositions();

    


    // Checking if Pattern allow entry into position
    let _openedPattern = this._checkPatternToOpen();
    if(!this.openedPatternToEnter || _openedPattern.depositPercent > this.openedPatternToEnter.depositPercent){
        this.openedPatternToEnter = _openedPattern
    }

    console.log('openedPatternToEnter: ', this.openedPatternToEnter)
    // Here 
    if (ActialPosition){}


    // Clean Signal - First positive Candle after green
    let CLEAN__SIGNAL = this._firstPositiveCandle();

    console.log({CLEAN__SIGNAL, OP: this.openedPatternToEnter})


  }
};
