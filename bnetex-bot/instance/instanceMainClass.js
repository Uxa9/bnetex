
const tgEvents = require('./utils/events').tgEvents

const db = require('../instance/db/sequelize/dbseq');
const TickerClassSimulate = require("./classes/tickeClassSimulate");
const ExchangeData = require("./classes/ExchangeData");
const PositionsModule = require("./classes/PositionsModule");
const AnalyzeModule = require("./classes/AnalyzeModules");
const DecisionsModule = require("./classes/DecisionsModule");
const { simulateEventer } = require('./utils/events');

var asciichart = require ('asciichart')

const moment = require('moment')

// Event Emmiter для симулятора

const config = require("../config/config")();

module.exports = class InstanceClass {
  constructor(pair) {


    this.pair = pair;

    this.exchangeData = new ExchangeData(this.pair)

    this.positionsData = new PositionsModule(this.pair)

    this.analyzeModule = new AnalyzeModule(this.pair, this.positionsData);

    this.DecisionsModule = new DecisionsModule(this.pair, this.positionsData);
    
  }
  

  


  async initializing() {

    

    

    // Формирование данных с биржи
    this.exchangeData.initializing().then(subscribtion => {   
      
      let prices = [];
      
      // Сюда данные пробрасываются каждую минуту
      subscribtion.subscribe(async (candlesData) => { 
        
        

        //console.log(moment(candlesData.last.startTime, 'x').format('DD MM YYYY HH:mm'))  

        if(prices.length > 60) prices.shift();

        prices.push(parseFloat(candlesData.last.close))
        //console.clear();
        //console.log (asciichart.plot (prices, { height: 12 }))
        
        // Пробрасываем последнюю свечу в модуль позиций
        this.positionsData.updateLastKline(candlesData.last)

        

        // Updating TG BOT Actual Info
        tgEvents.emit('updateKline', candlesData.last);

        
        
        // Actual Position's Module | Trying to close actual positions      
        await this.positionsData.closePositions();
        

        
        
        // Updating actual market data for analyze module && Calling global analyze function
        let analyzeResult = await this.analyzeModule.updateMarketData(candlesData.last).analyze(); if(!analyzeResult) return;

        
        

        

        /**
         * Updating actual analyze Result in DesisionsModule && Calling function that decides whether to enter a position or average
         * 
         */

        let decideResult = await this.DecisionsModule.updateMarketData(candlesData.last).updateAnalyzeResponse(analyzeResult, candlesData.last_100).decisionAction();
        
        

        let ANALYZE_ACTIONS = ['AVERAGE_BY_NEW_CONTIDION', 'CREATE_NEW_POSITION'];

        

        if(ANALYZE_ACTIONS.includes(decideResult.code)){

          // Сбрасываем запомненный паттерн на вход
          await this.analyzeModule.clearCurrentPattern();


        }

        
        
        

        if(config.simulate){

          simulateEventer.emit('callNextCandle', candlesData.last);
          
          
        }

      })
    })
    
 
  }

  
};
