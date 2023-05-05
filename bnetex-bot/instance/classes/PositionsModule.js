const db = require("../db/sequelize/dbseq");
const Account = require("../utils/binance/account");
const {
  getBBRuleByIddex,
  getBBRulesIndexes,
} = require("../utils/BollZoneRules");
const StrategyRules = require("../utils/strategy/StrategyRules");
const FuturesModule = require("./FuturesModule");
const moment = require('moment');
const binance = require("../utils/binance");
const { Op } = require("sequelize");
const { sendMessageToMainChanel } = require("../utils/telegram/tg");
const config = require('../../config/config')()

module.exports = class PositionsModule {
  constructor(pair) {
    this.pair = pair;
    this.lastKline = undefined;
    this.exchangeAccount = new Account();


    this.TotalDeposit = 0;
    

    this.futures = new FuturesModule(this.pair, this);

    

  }


  async getExchangePosition(){

  }

  async closeFrontPosition(POSITIONId, qty, user, marketSell, OPENED_POSITION){
      
      let position = await db.models.Position.findByPk(POSITIONId);

      console.log(marketSell)

      if(!user.tradeBalance || user.tradeBalance == 0){
        sendMessageToMainChanel(`При остановке алгоритма обнаружен пустой баланс пользователя ${user.email}`);
      }

      qty = parseFloat(qty);

      if(position.volumeACTIVE == qty){
        
        let mockLastKline = {
          close: parseFloat(marketSell.avgPrice),
          endTime: marketSell.updateTime
        }
        this.updateLastKline(mockLastKline);
        
        return await this.closePositions(true, OPENED_POSITION);

      }else{
        
          return await db.models.Position.update({volumeACTIVE: position.volumeACTIVE - qty, totalDeposit: position.totalDeposit - user.tradeBalance},  {
            where: {
              id: position.id          
            }
          })
          
      }


      

  }
  

  

  /**
   * Function sets minimal price to position
   * @param {*} POSITION
   * @param {*} price
   * @returns
   */
  async _setMinPrice(POSITION, price) {

    
    if (POSITION.minPrice <= price && POSITION.minPrice != null) return;

    await db.models.Position.update(
      { minPrice: price },
      { where: { id: POSITION.id } }
    );
  }

  /**
   * Update last kline
   * @param {*} kline 
   */
  updateLastKline(kline) {
    this.lastKline = kline;
    this.actualPrice = parseFloat(kline.close);
  }

  /**
   * Function tries to close actual positions
   * @returns
   */
  async closePositions(nonPattern = false, OPENED_POSITION = false) {

    
    // Checking if there are actual positions
    let actualPosition = await this.getActualPositions();
    
    
    if (!actualPosition) return null;

    // Setting minimal price to pofition
    await this._setMinPrice(actualPosition, this.actualPrice);

    // Calculating actual profit
    let percentProfit = this._calcProfitPercent(
      actualPosition.averagePrice,
      this.actualPrice
    );
    
    

    // Checking that Position has enougth profit to close
    let enougthProfit = actualPosition.ACTIVE_GROUP.ProfitPercent;

    

    // Break current method if percent profit is not enougth
    if (percentProfit < enougthProfit && !nonPattern) return;

    // Checking condition to close position
    let groupped = groupByRules(actualPosition.ACTIVE_GROUP.ACTIVE_GROUP_TRIGGERs.filter((i) => i.type == "CLOSE"));

    let patternCompare = false;

    if(!nonPattern){

      patternCompare = StrategyRules(this.lastKline, groupped, true, true);

    }
    let POSITION_ACTIVE = undefined;
    if(!OPENED_POSITION){
      POSITION_ACTIVE = await this.exchangeAccount.getOpenPositions(this.pair, actualPosition);
    }else{
      POSITION_ACTIVE = OPENED_POSITION;
    }
    

    // Volume of buy 
    let buyVolume = actualPosition.averagePrice * parseFloat(POSITION_ACTIVE.positionAmt)
    let sellVolume = this.actualPrice * parseFloat(POSITION_ACTIVE.positionAmt)
    
        
    // Calculated Profit if positions will be closed now
    let profitVolume = sellVolume - buyVolume;

    //patternCompare = false;

    // If Theres is not conditions for close position - break method
    if(!patternCompare && !nonPattern) return null;

    // Params to set into positions in DB
    let mysqlPARAMS = {status: false, closeTime: moment(this.lastKline.endTime, 'x').toDate(), percentProfit, closePrice: parseFloat(this.lastKline.close), sumProfit: profitVolume}
    
    // Updating position in MYSQL
    await db.models.Position.update(mysqlPARAMS, {where: {id: actualPosition.id}})

    

    if(!nonPattern){
      // Close Postitons on Exhcnage
      let marketSell = await this.futures.marketSell(actualPosition.volumeACTIVE);

      await this._deactivatePatterns();
    }
    

    return null;
  }

  /**
   * Function calcs Percent of profif by averagePrice && actualPrice
   * @param {*} averagePrice
   */
  _calcProfitPercent(averagePrice, actualPrice) {
    return 100 - (averagePrice * 100) / actualPrice;
  }


  /**
     * Deactivating all patterns     
     */
  async _deactivatePatterns(){    

    return await db.models.Pattern.update({status: false}, {where: {
      id: {
        [Op.gt]: 0
      }
    }})

  }

  

  /**
   * Function returns actual positions
   * @returns
   */
  async getActualPositions() {

    let position = undefined;    

    
    
    
    try{

      position = await db.models.Position.findOne({

        where: { pair: this.pair, status: true },
        include: [
          {
            model: db.models.ActiveGroups,
            include: [
              {
                model: db.models.ActiveGroupTriggers,
              },
              {
                model: db.models.Rules
              },
              {
                model: db.models.Pattern
              }
            ],
          },
          {
            model: db.models.PositionEnters
          }
        ],
      });

    }catch(e){
      console.log(e)
    }

    
    
    
    if (!position) return null;

    return position;
  }

  async updatePosition(POSITION, marketBuy, ACTIVE_GROUP, enterStep, enterPrice, deposit, tradingVolume){

    // Получаем текущую позицию с биржи
    let binancePositions = await this.futures.futuresPositionRisk(marketBuy, this.pair);

    let exchangePosition = binancePositions.filter(i => i.symbol == this.pair);

    if(exchangePosition.length == 0) return;

    exchangePosition = exchangePosition[0];

    
    if(config.simulate){

      await db.models.PositionEnters.create({
        volumeUSDT: parseFloat(marketBuy.cumQty)/10,
        volume: parseFloat(marketBuy.cumQuote),
        step: enterStep,
        POSITIONId: POSITION.id,
        ACTIVEGROUPId: ACTIVE_GROUP,
        close: enterPrice,
        createdAt: moment(this.lastKline.startTime, 'x').toDate(),
        unittimestamp: this.lastKline.startTime,
        tradingVolume
      })


    }else{

      await db.models.PositionEnters.create({
        volumeUSDT: parseFloat(marketBuy.cumQuote),
        volume: parseFloat(marketBuy.cumQty),
        step: enterStep,
        POSITIONId: POSITION.id,
        ACTIVEGROUPId: ACTIVE_GROUP,
        close: enterPrice,
        createdAt: moment(this.lastKline.startTime, 'x').toDate(),
        unittimestamp: this.lastKline.startTime,
        tradingVolume
      })

    }
    

    
    return await db.models.Position.update({
      avegarePrice: parseFloat(exchangePosition.entryPrice),
      averagePrice: parseFloat(exchangePosition.entryPrice),
      lastEnterPrice: parseFloat(marketBuy.avgPrice),
      ACTIVEGROUPId: ACTIVE_GROUP,
      volumeACTIVE: POSITION.volumeACTIVE + parseFloat(marketBuy.cumQuote),
      volumeUSDT: POSITION.volumeUSDT + parseFloat(marketBuy.cumQty)/10,
      enterStep,
      deposit
    }, {where: {
      id: POSITION.id
    }})

  }


  async createPosition(margin, enterPrice, qty, ACTIVE_GROUP, deposit, unixtime, totalDeposit, tradingVolume){
    
    let position = await db.models.Position.create({
      volumeUSDT: margin,
      volumeACTIVE: qty,
      pair: this.pair,
      enterStep: 1,
      ACTIVEGROUPId: ACTIVE_GROUP,
      status: true,
      positionType: 'LONG',
      averagePrice: enterPrice,
      avegarePrice: enterPrice,
      enterPrice,
      deposit,
      lastEnterPrice: enterPrice,
      enterTime: moment(unixtime, 'x').toDate(),
      totalDeposit: totalDeposit
    })
    
    await db.models.PositionEnters.create({
      volume: qty,
      volumeUSDT: margin,
      step: 1,
      POSITIONId: position.id,
      ACTIVEGROUPId: ACTIVE_GROUP,
      close: enterPrice,
      createdAt: moment(this.lastKline.startTime, 'x').toDate(),
      unittimestamp: this.lastKline.startTime,
      tradingVolume
    })

  }

  _groupByRules(ACTIVE_GROUP_TRIGGERs) {
    let zoneRulesBB = getBBRulesIndexes();

    let rules = zoneRulesBB.map((i) => getBBRuleByIddex(i));

    let grouppedTriggers = rules.map((i) =>
      ACTIVE_GROUP_TRIGGERs.filter(
        (j) => j.sigma == i.sigma && j.intervals == i.intervals
      )
    );

    return grouppedTriggers.filter((i) => i.length > 0);
  }
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
