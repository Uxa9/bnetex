const binance = require("../binance");
const { sendMessageToMainChanel } = require("../telegram/tg");


const config = require("../../../config/config")();

module.exports = async (sum, close, pair) => {


    

    let volume = parseFloat((sum/close) * 10).toFixed(3);

    

    if(config.simulate){
        return {
            avgPrice: close,
            cumQty: volume,
            mode: config.simulate ? 'simulate' : 'prod',
            cumQuote: sum
        }
    }


    
    
    

    let BINANCE__POSITION = false;
    
    try{
        BINANCE__POSITION = await binance.futuresMarketBuy( pair, volume, { newOrderRespType: 'RESULT', recvWindow: 60000})

        if(BINANCE__POSITION && BINANCE__POSITION.code == -2019){
            await sendMessageToMainChanel(`Ошибка покупки по маркету : ${BINANCE__POSITION.msg}`)
            return false;
        }

    }catch(e){
        await sendMessageToMainChanel(`Ошибка покупки по маркету: ${e}`)
    }

    

    
    return BINANCE__POSITION

}