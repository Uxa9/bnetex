const Account = require("../../../../utils/binance/account");
const db = require("../../dbseq")

const config = require("../../../../../config/config")();

const moment = require('moment');

module.exports = async (sum, close, currentPosition, time, BINANCE__POSITION, PAIR) => {
    
    


    // Устанавливаем цену входа, данную от бинансе
    close = BINANCE__POSITION.avgPrice;

    // Устанавливаем обьем - полученный от бинанса
    volume = BINANCE__POSITION.cumQty;   

    let account = new Account()



    let position = undefined;

    try{
      position = await account.getOpenPositions(PAIR)
    }catch(e){
      position = {
        updateTime: time,
        enterPrice: close,
        initialMargin: sum/10
      }
    }

    

    
    let volumeUSDT = parseFloat(position.initialMargin);

    // Текущая позиция
    let BALANCE__POSITION = await account.getOpenPositions(PAIR);    

    
    let params = {
        volumeACTIVE: parseFloat(BINANCE__POSITION.cumQty) + currentPosition.volumeACTIVE,
        avegarePrice: parseFloat(position.entryPrice),
        volumeUSDT: volumeUSDT,
        enterStep: currentPosition.enterStep + 1,
        lastEnterPrice: parseFloat(BINANCE__POSITION.avgPrice),
        avegarePrice: BALANCE__POSITION.entryPrice,
    }



    if(config.simulate){
      
      let allEnters = await db.models.PositionEnters.findAll({where: {
        POSITIONId: currentPosition.id
      }})

      let avPrice = allEnters.reduce((prev, curr) => prev + curr.close, 0) / allEnters.length

      params = {
        volumeUSDT: currentPosition.volumeUSDT + (sum),
        enterStep: currentPosition.enterStep + 1,
        lastEnterPrice: close,
        avegarePrice: avPrice
      }
    }


    


    position = await db.models.Position.update(params, {where: {id: currentPosition.id}})

    

    await db.models.PositionEnters.create({volume: BINANCE__POSITION.cumQty, createdAt: moment(time, 'x').toDate(), volumeUSDT: sum, step: params.enterStep, POSITIONId: currentPosition.id, close})

}