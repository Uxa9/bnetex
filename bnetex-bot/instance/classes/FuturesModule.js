const binance = require("../../instance/utils/binance");

module.exports = class FuturesModule{

    constructor(pair){
        this.pair = pair;
    }

    /**
     * Function call binance action for BUY with MARKET price
     * @param {*} qty 
     */
    async marketBuy(qty){

        return await binance.futuresMarketBuy( this.pair, qty, { newOrderRespType: 'RESULT', recvWindow: 60000})

    }



    /**
     * Function call binance action for SELL with MARKET price
     * @param {*} qty 
     */
    async marketSell(qty){

        return await binance.futuresMarketSell( this.pair, qty, { newOrderRespType: 'RESULT', recvWindow: 60000})

    }

}