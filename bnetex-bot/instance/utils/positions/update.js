const mongoose = require("mongoose");



var moment = require("moment");
const db = require("../../db/db");
const Positions = require("../../db/schemes/positions/Positions");
const Account = require("../binance/account");



module.exports.UpdatePosition = async (sum, close, currentPosition, klineTime, BINANCE__POSITION, PAIR) => {


    let account = new Account()
    


    

    
    // Устанавливаем цену входа, данную от бинансе
    close = BINANCE__POSITION.avgPrice;

    // Устанавливаем обьем - полученный от бинанса
    volume = BINANCE__POSITION.cumQty;   



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

    
    

    
    let md = await db(Positions);



    let volumeUSDT = parseFloat(position.initialMargin);


    let positionEnters = currentPosition.positionEnters;

    positionEnters.push({
      buyPrice: close,
      avegarePrice: parseFloat(BINANCE__POSITION.avgPrice),
      volumeUSDT: parseFloat(BINANCE__POSITION.cumQuote) / 10,
      volume: parseFloat(BINANCE__POSITION.cumQty),
      time: klineTime
    })

    
    let params = {
        volume: parseFloat(BINANCE__POSITION.cumQty) + currentPosition.volume,
        avegarePrice: parseFloat(position.entryPrice),
        volumeUSDT: volumeUSDT,
        enterStep: currentPosition.enterStep + 1,
        lastEnterPrice: parseFloat(BINANCE__POSITION.avgPrice),
        positionEnters
    }

   
    

    let data = await md.updateOne({_id: currentPosition._id}, {$set: params});
      
    return data;

      
  };

