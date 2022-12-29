const getPatternRuleMySQL = require("../../db/sequelize/actions/patterns/getPatternRuleMySQL");
const changePositionStepMySQL = require("../../db/sequelize/actions/positions/changePositionStepMySQL");
const createPositionMySQL = require("../../db/sequelize/actions/positions/createPositionMySQL");
const getCurrentPositionMySQL = require("../../db/sequelize/actions/positions/getCurrentPositionMySQL");

const UpdatePositionMySQL = require("../../db/sequelize/actions/positions/UpdatePositionMySQL");
const marketBuy = require("../binance/marketBuy");

const { api } = require("../telegram/axios");
const { sendMessageToMainChanel } = require("../telegram/tg");


module.exports = async (PATTERN__SIGNAL, PAIR, intervalsData) => {

        
        
        

        // Получаем активную позицию
        let currentPosition = await getCurrentPositionMySQL({status: true, pair: PAIR});

        
        let close = parseFloat(intervalsData.close)

        let time = intervalsData.endTime;

        // Разрешенный депозит с сайта
        let depoServer = false;

        try{
             depoServer = await api.get('/users/totalInvestAmount/get');
             if(depoServer){
                depoServer = depoServer.data;
             }
        }catch(e){
            await sendMessageToMainChanel(`Ошибка получение инвестиционного депозита с сайта: ${e}`)
        }
        
        
        
        

        // Надо брать из системы сайта
        let totalDeposit = 0;
        if(depoServer){
            totalDeposit = depoServer;
        }

        totalDeposit = 1000;

        let currentStep = undefined;
        let currentGroup = undefined;


        // Если позиция есть - запоминаем активную группу
        if(currentPosition){
            currentStep = currentPosition.enterStep;
            currentGroup = currentPosition.ACTIVEGROUPId;
        }
        
        
        
        

        // Флаг изменения паттерна актуальной позции
        let patternChanged = false;
        
        if(currentPosition && currentPosition.ACTIVEGROUPId < PATTERN__SIGNAL){                
            console.log("Change Pattern")
            patternChanged = true;                
            await changePositionStepMySQL(currentPosition.id, {ACTIVEGROUPId: PATTERN__SIGNAL, enterStep: 0 })                
            currentPosition = await getCurrentPositionMySQL({status: true, pair: PAIR});

        }

        let patternEnter = PATTERN__SIGNAL;

        

        // Правила входа и усреднения
        let positionsRules = await getPatternRuleMySQL((patternChanged || (currentPosition && currentPosition.enterStep == 0)) ? 1 : currentPosition ? currentPosition.enterStep+1 : 1 , patternEnter)

        
        

        
        


        

        

        if(currentPosition){
            patternEnter = currentPosition.ACTIVEGROUPId;
            totalDeposit = currentPosition.deposit;
        }        
        

        
        
        
        
        // Если нету правил для входа
        if(!positionsRules) return;


        console.log('buySignalHandler', PATTERN__SIGNAL);
        
        

        // Рассчитываем процент от депозита позиции для входа/усреднения
        // Тут от порядкового номера входа рассчитывается депозит
        let percentOfStep = positionsRules.depositPercent;
        let sumOfStep = (totalDeposit/100*percentOfStep);

        

        

        if(!currentPosition){
            
            console.log("Create Position")
            

            let market__buy = await marketBuy(sumOfStep, close, PAIR);            
            
            
            // Если врдуг ошибка покупки - нихера не делаем            
            if(!market__buy) return;
            
            await createPositionMySQL(market__buy, totalDeposit, patternEnter, PAIR, sumOfStep, close, time)
            
            
        }else{
                            
            // Если цена закрытия меньше средней, то усредняем
            
            console.log("To Average")
            let diffPercent = 100-(close * 100 / currentPosition.lastEnterPrice)                        
            
            if((close < currentPosition.lastEnterPrice) && currentPosition.ACTIVEGROUPId == PATTERN__SIGNAL){

                // Ищем разницу в цене в %                
                console.log({diffPercent, priceDifferencePercent: positionsRules.priceDifferencePercent})
                // Если разница в цене больше или равно указанной в правилах                                
                if(diffPercent >= positionsRules.priceDifferencePercent){
                    
                    let market__buy = await marketBuy(sumOfStep, close, PAIR);            
                    console.log("Averaging")
                    await UpdatePositionMySQL(sumOfStep, close, currentPosition, time, market__buy, PAIR)
                    
                }else{
                    await changePositionStepMySQL(currentPosition.id, {ACTIVEGROUPId: currentGroup, enterStep: currentStep })                
                }
                
            }else{
                await changePositionStepMySQL(currentPosition.id, {ACTIVEGROUPId: currentGroup, enterStep: currentStep })                
            }
            
        }

        
}