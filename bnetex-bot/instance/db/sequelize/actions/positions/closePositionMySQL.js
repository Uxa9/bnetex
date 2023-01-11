const Account = require("../../../../utils/binance/account");
const marketSell = require("../../../../utils/binance/marketSell");
const db = require("../../dbseq");
const changePositionStepMySQL = require("./changePositionStepMySQL");
const getCurrentPositionMySQL = require("./getCurrentPositionMySQL");
const getPosition = require("./getPosition");

const config = require('../../../../../config/config')()

const moment = require('moment');

module.exports = async (pair, kline, profit) => {
    
    console.log('CLose Position')

    let account = new Account()

    let position = await getCurrentPositionMySQL({pair, status: true});

    if(!position) return;


    let POSITION_ACTIVE = await account.getOpenPositions(pair);


    



    let ActualProfit = undefined;

    ActualProfit = 100 - ((position.avegarePrice / parseFloat(kline.close)) * 100);      

    let sumProfit = ((position.volumeUSDT*10) / 100) * ActualProfit;


    // Если реальная торговля - умножать на 10 не надо
    if(!config.simulate){
        sumProfit = (position.volumeUSDT / 100) * ActualProfit;
    }

    if(ActualProfit >= profit){
        
        await changePositionStepMySQL(position.id, {status: false, closeTime: moment(kline.endTime, 'x').toDate(), percentProfit: ActualProfit, closePrice: parseFloat(kline.close), sumProfit});
        await marketSell(pair, parseFloat(POSITION_ACTIVE.positionAmt))
    }

    









    
    
}