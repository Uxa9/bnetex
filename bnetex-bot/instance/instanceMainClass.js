
const tgEvents = require('./utils/events').tgEvents

const db = require('../instance/db/sequelize/dbseq');
const TickerClassSimulate = require("./tickeClassSimulate");
const ExchangeData = require("./classes/ExchangeData");
const PositionsModule = require("./classes/PositionsModule");
const AnalyzeModule = require("./classes/AnalyzeModules");
const DecisionsModule = require("./classes/DecisionsModule");
const { simulateEventer } = require('./utils/events');

const moment = require('moment')

// Event Emmiter для симулятора

const config = require("../config/config")();

module.exports = class InstanceClass {
  constructor(pair) {


    this.pair = pair;

    this.exchangeData = new ExchangeData(this.pair)

    this.positionsData = new PositionsModule(this.pair)

    this.analyzeModule = new AnalyzeModule(this.pair, this.positionsData);

    this.DecisionsModule = new DecisionsModule(this.pair);
    
  }
  

  


  async initializing() {

    let diffClosePositionTime = [];

    let diffAnalyzeTime = [];

    let diffDecideTime = [];

    let totalTime = [];

    let loopTime = new Date();

    

    // Формирование данных с биржи
    this.exchangeData.initializing().then(subscribtion => {   
      
      
      
      // Сюда данные пробрасываются каждую минуту
      subscribtion.subscribe(async (candlesData) => { 
        
        //console.log(`Loop time: ${(new Date() - loopTime) / 1000}`);

        let loopTimeSingle = (new Date() - loopTime) / 1000;

        console.log(`Probably year time: ${(loopTimeSingle * 60 * 24 * 7 * 4 * 12) / 60 / 60} hours`)

        loopTime = new Date();

        let totalTimeStart = new Date();
        
        // Пробрасываем последнюю свечу в модуль позиций
        this.positionsData.updateLastKline(candlesData.last)

        

        // Updating TG BOT Actual Info
        tgEvents.emit('updateKline', candlesData.last);

        
        let closePositionTimeStart = new Date();
        // Actual Position's Module | Trying to close actual positions      
        await this.positionsData.closePositions();
        diffClosePositionTime.push((new Date() - closePositionTimeStart) / 1000)

        
        let AnalyzeTimeStart = new Date();
        // Updating actual market data for analyze module && Calling global analyze function
        let analyzeResult = await this.analyzeModule.updateMarketData(candlesData.last).analyze(); if(!analyzeResult) return;

        diffAnalyzeTime.push((new Date() - AnalyzeTimeStart) / 1000)
        

        

        /**
         * Updating actual analyze Result in DesisionsModule && Calling function that decides whether to enter a position or average
         * 
         */
        let DecideTimeStart = new Date();
        let decideResult = await this.DecisionsModule.updateMarketData(candlesData.last).updateAnalyzeResponse(analyzeResult, candlesData.last_100).decisionAction();
        diffDecideTime.push((new Date() - DecideTimeStart) / 1000)
        

        let ANALYZE_ACTIONS = ['AVERAGE_BY_NEW_CONTIDION', 'CREATE_NEW_POSITION'];

        

        if(ANALYZE_ACTIONS.includes(decideResult.code)){

          // Сбрасываем запомненный паттерн на вход
          await this.analyzeModule.clearCurrentPattern();


        }

        
        
        totalTime.push((new Date() - totalTimeStart) / 1000)

        if(config.simulate){

          //console.log(`${moment(candlesData.last.startTime, 'x').format('DD/MM/YYYY HH:mm')}`)
          let summExecuteTimeClosePosition = diffClosePositionTime.reduce((prev, curr) => prev + curr, 0);
          //console.log(`summExecuteTimeClosePosition:  ${summExecuteTimeClosePosition / diffClosePositionTime.length}`)
          
          let summDiffAnalyzeTime = diffAnalyzeTime.reduce((prev, curr) => prev + curr, 0);
          //console.log(`summDiffAnalyzeTime:  ${summDiffAnalyzeTime / diffAnalyzeTime.length}`)


          //let summDiffDecideTime = diffDecideTime.reduce((prev, curr) => prev + curr, 0);
          //console.log(`summDiffDecideTime:  ${summDiffDecideTime / diffDecideTime.length}`)

          //let summTotalTime = totalTime.reduce((prev, curr) => prev + curr, 0);
          //console.log(`summTotalTime:  ${summTotalTime / totalTime.length}`)



          simulateEventer.emit('callNextCandle', candlesData.last);
          
          
        }

      })
    })
    
 
  }

  
};
