
const positions = require('../services/positions');
const marketSell = require("../../instance/utils/binance/marketSell");
const { sendMessageToMainChanel } = require('../../instance/utils/telegram/tg');

var express = require("express"),
  router = express.Router();


  router.use('/history', async (req,res) => {
    console.log(req)

    if(!req.requestParams.from || !req.requestParams.to){
        res.status(400);
        res.json({error: true, detail: 'from & to is required parameters'})
        return;
    }

    let position = await positions.getByPeriod(req.requestParams.from,req.requestParams.to)

    res.json({status: 'ok', response: position})

  })


  router.get('/activePositions/:timestamp', async (req,res) => {
    
    let result = await positions.getByStartTime(req.params.timestamp)

    

    res.json(result)

  })

  // Endpoind на закрытие обьеба
  router.post('/closeVolumeMarket', async (req,res) => {

    let volumeToClose = req.requestParams.volumeToClose;

    if(volumeToClose.length == 0 ) return;

    let messageToChanel = `<b>Остановка автоматической торговли</b> \nЗакрытие объемов пользователя <b>${req.requestParams.user.email} </b> \nТорговый баланс : <b>${req.requestParams.user.tradeBalance}</b> USDT \n`
    
    //console.log("Количество пар на закрытие:", volumeToClose.length)

    for (let index = 0; index < volumeToClose.length; index++) {
      const element = volumeToClose[index];
      if(element.type == 'SELL'){
          
          console.log(`Продать ${element.volumeToMarketSellBuy} актива ${element.pair}`)          
          await marketSell(element.pair, parseFloat(element.volumeToMarketSellBuy))

          messageToChanel += `Товровая пара: <b>${element.pair}</b> | Объем : <b>${parseFloat(element.volumeToMarketSellBuy)}</b> \n`
      }
      
    }

    
    sendMessageToMainChanel(messageToChanel)


    res.json({response: req.requestParams.volumeToClose})

  })

module.exports = router;

