
const positions = require('../services/positions');
const marketSell = require("../../instance/utils/binance/marketSell");
const { sendMessageToMainChanel } = require('../../instance/utils/telegram/tg');
const getPairsListMySQL = require('../../instance/db/sequelize/actions/pairs/getPairsListMySQL');
const createPairMySQL = require('../../instance/db/sequelize/actions/pairs/createPairMySQL');
const updatePairStatusMySQL = require('../../instance/db/sequelize/actions/pairs/updatePairStatusMySQL');
const getPatterntMySQL = require('../../instance/db/sequelize/actions/patterns/getPatterntMySQL');
const createConditionMySQL = require('../../instance/db/sequelize/actions/patterns/createConditionMySQL');
const removeConditionMySQL = require('../../instance/db/sequelize/actions/patterns/removeConditionMySQL');
const getPattenrGroupsMySQL = require('../../instance/db/sequelize/actions/patterns/getPattenrGroupsMySQL');
const createConditionGroupMySQL = require('../../instance/db/sequelize/actions/patterns/createConditionGroupMySQL');
const removeRule = require('../../instance/utils/patterns/removeRule');
const createRuleMySQL = require('../../instance/db/sequelize/actions/patterns/createRuleMySQL');
const config = require('../../config/config')();

var express = require("express"),
  router = express.Router();


  router.use('/history', async (req,res) => {
    console.log(req)

    if(!req.requestParams.periodMonth){
        res.status(400);
        res.json({error: true, detail: 'periodMonth is required'})
        return;
    }

    let position = await positions.getByPeriod(req.requestParams.periodMonth)

    res.json({status: 'ok', response: position})

  })

  router.get('/getTradingPairs/', async (req,res) => {    
    getPairsListMySQL().then(result => {
      res.json(result)
    })
  })

  router.get('/getTradingPatterns/:pair', async (req,res) => {
    getPatterntMySQL({TRADINGPAIRId: req.params.pair}).then(e => {
      res.json(e)
    })
  })
  
  router.get('/getPatterGroups/:pattern', (req,res) => {
    
    getPattenrGroupsMySQL(req.params.pattern).then(_ => {
      res.json(_  )
    })
  })

  router.post('/addRule', (req,res) => {
    
      createRuleMySQL(req.requestParams).then(e => {
        res.status(200)
        res.json({status: 'ok'})
      })

      
  })

  router.post('/removeRule', (req,res) => {
    
    removeRule(req.requestParams.id).then(e => {
      res.json(e);
    })    
    
  })

  router.post('/addPairCondition', (req,res) => {
    createConditionMySQL(req.requestParams).then(e => {
      res.json(e);
    })    
  })

  router.post('/addGroupCondition', (req,res) => {
    createConditionGroupMySQL(req.requestParams).then(e => {
      res.json(e);
    })    
  })

  router.post('/removePairCondition', (req,res) => {
    
    removeConditionMySQL(req.requestParams.id).then(e => {
      res.json(e);
    })    

  })


  router.post('/removeGroupCondition', (req,res) => {
    
    removeConditionMySQL(req.requestParams.id, true).then(e => {
      res.json(e);
    })    

  })

  router.post('/appTradingPair', (req,res) => {
    
    createPairMySQL(req.requestParams.name).then((e) => {
      res.json(e)
    }).catch(error => {
      res.status(400);      
      res.json({message: error.message})
    })
    
  })


  router.post('/updateTradingPair', (req,res) => {
    console.log(req.requestParams)
    updatePairStatusMySQL(req.requestParams.id, req.requestParams.Status).then(e => {
      res.json(e)
    }).catch(error => {
      console.log(error)
    })
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

