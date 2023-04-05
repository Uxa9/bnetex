const binance = require("../../instance/utils/binance");
const { sendMessageToMainChanel } = require("../utils/telegram/tg");

const config = require('../../config/config')()



module.exports = class FuturesModule{

    constructor(pair, PositionsData){
        this.pair = pair;

        this.PositionsModule = PositionsData
    }

    /**
     * Function call binance action for BUY with MARKET price
     * @param {*} qty 
     */
    async marketBuy(qty, close = undefined){

        
        if(qty == 0 || !qty){
            let txt = `❌❌❌ \n <b>Ошибка ${this.pair}!</b> \n Недостаточно обьема для покупки актива \n`;
            sendMessageToMainChanel(txt);
            throw new Error("QTY Error");

        }

        if(config.simulate){

            let marketBuyMock = {
                cumQuote: qty,
                cumQty: qty * close,
                avgPrice: close,
                orderId: 1
            }

            let actualPosition = await this.PositionsModule.getActualPositions();

            if(actualPosition){
                console.log({actualPosition})
            }

            console.log(marketBuyMock)

            return marketBuyMock;

        }

        return await binance.futuresMarketBuy( this.pair, qty, { newOrderRespType: 'RESULT', recvWindow: 60000})

    }

    async futuresPositionRisk(marketBuy = undefined, symbol = undefined){

        if(config.simulate){

            let actualPosition = await this.PositionsModule.getActualPositions();

            if(actualPosition){

                console.log(actualPosition.POSITION_ENTERs);

                let totalBuyPrice = [...actualPosition.POSITION_ENTERs, {close: marketBuy.avgPrice, volume: parseFloat(marketBuy.cumQuote)}].map(i => i.close * i.volume).reduce((prev, curr) => prev + curr, 0);

                let totalActiveVolume = [...actualPosition.POSITION_ENTERs, {volume: parseFloat(marketBuy.cumQuote)}].map(i => i.volume).reduce((prev, curr) => prev + curr, 0);

                let avegarePrice = totalBuyPrice / totalActiveVolume;
                
                //console.log({totalBuyPrice, totalActiveVolume, avegarePrice, marketBuy})

                return [
                    {
                        symbol: symbol,
                        entryPrice: avegarePrice
                    }
                ]

                process.exit();
            }

        }

        return await binance.futuresPositionRisk();

    }



    /**
     * Function call binance action for SELL with MARKET price
     * @param {*} qty 
     */
    async marketSell(qty){

        return await binance.futuresMarketSell( this.pair, qty, { newOrderRespType: 'RESULT', recvWindow: 60000})

    }

}