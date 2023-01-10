const mongoose = require("mongoose");





var moment = require("moment");
const Account = require("../binance/account");
const db = require("../../db/db");
const Positions = require("../../db/schemes/positions/Positions");





module.exports.CreatePosition = async (BINANCE__POSITION, deposit, patternEnter, PAIR) => {


    


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

    

    

    if(!position) return;

    
    
    
    let md = await db(Positions);


    

    let params = {
        deposit: deposit,
        enterTime: position.updateTime,
        enterPrice: parseFloat(BINANCE__POSITION.avgPrice),
        avegarePrice: parseFloat(BINANCE__POSITION.avgPrice),
        positionType: 'LONG',
        status: true,
        volume: volume,
        volumeUSDT: parseFloat(position.initialMargin),
        enterStep: 1,
        patternEnter,
        lastEnterPrice: close,
        minPrice: close,
        pair: PAIR,
        positionEnters: [
          {            
            buyPrice: parseFloat(BINANCE__POSITION.avgPrice),
            avegarePrice: parseFloat(BINANCE__POSITION.avgPrice),                        
            volume: volume,
            volumeUSDT: parseFloat(position.initialMargin),
            time: position.updateTime
          }
        ]
    }
    
    let data = await md.create(params)
      
    return data;

      
  };

