const binance = require("../binance");
const { sendMessageToMainChanel } = require("../telegram/tg");


module.exports = async (pair,volume) => {

    
    let BINANCE__POSITION = false;
    
    try{
        BINANCE__POSITION = await binance.futuresMarketSell( pair, volume, { newOrderRespType: 'RESULT', recvWindow: 60000})

        if(BINANCE__POSITION && BINANCE__POSITION.code == -2019){
            await sendMessageToMainChanel(`Ошибка проаджи по маркету : ${BINANCE__POSITION.msg}`)
            return false;
        }

    }catch(e){
        await sendMessageToMainChanel(`Ошибка проаджи по маркету: ${e}`)
    }

    
    return BINANCE__POSITION

}