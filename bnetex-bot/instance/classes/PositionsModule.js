const db = require("../db/sequelize/dbseq");
const Account = require("../utils/binance/account");
const {
  getBBRuleByIddex,
  getBBRulesIndexes,
} = require("../utils/BollZoneRules");
const StrategyRules = require("../utils/strategy/StrategyRules");
const FuturesModule = require("./FuturesModule");
const moment = require('moment')

module.exports = class PositionsModule {
  constructor(pair) {
    this.pair = pair;
    this.lastKline = undefined;
    this.exchangeAccount = new Account()

    this.futures = new FuturesModule(this.pair);
  }

  /**
   * Function sets minimal price to position
   * @param {*} POSITION
   * @param {*} price
   * @returns
   */
  async _setMinPrice(POSITION, price) {
    if (POSITION.minPrice <= price) return;

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
  async closePositions() {
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
    if (percentProfit < enougthProfit) return;

    // Checking condition to close position
    let groupped = this._groupByRules(
      actualPosition.ACTIVE_GROUP.ACTIVE_GROUP_TRIGGERs.filter(
        (i) => i.type == "CLOSE"
      )
    );

    let patternCompare = StrategyRules(this.lastKline, groupped, true, true);

    patternCompare = true;

    console.log({ patternCompare });

    let POSITION_ACTIVE = await this.exchangeAccount.getOpenPositions(this.pair);

    // Volume of buy 
    let buyVolume = actualPosition.averagePrice * parseFloat(POSITION_ACTIVE.positionAmt)
    let sellVolume = this.actualPrice * parseFloat(POSITION_ACTIVE.positionAmt)

    console.log({ap: actualPosition.averagePrice, papa: POSITION_ACTIVE.positionAmt, acprive: this.actualPrice})

    let profitVolume = sellVolume - buyVolume;

    console.log({profitVolume})

    

    if(!patternCompare) return null;
    let mysqlPARAMS = {status: false, closeTime: moment(this.lastKline.endTime, 'x').toDate(), percentProfit, closePrice: parseFloat(this.lastKline.close), sumProfit: profitVolume}
    console.log({mysqlPARAMS})
    //await db.models.Position.update(params, {where: {id: actualPosition.id}})

    //await this.futures.marketSell(actualPosition.volumeACTIVE);

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
   * Function returns actual positions
   * @returns
   */
  async getActualPositions() {
    let position = await db.models.Position.findOne({
      where: { pair: this.pair, status: true },
      include: [
        {
          model: db.models.ActiveGroups,
          include: [
            {
              model: db.models.ActiveGroupTriggers,
            },
          ],
        },
      ],
    });

    if (!position) return null;

    return position;
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
