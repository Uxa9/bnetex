const matching = require("../utils/marketMathing/matching");
const db = require("../db/sequelize/dbseq");
const matrixMatching = require("../utils/marketMathing/matrixMatching");
const { Op } = require("sequelize");
const { getBBRulesIndexes, getBBRuleByIddex } = require("../utils/BollZoneRules");
const StrategyRules = require("../utils/strategy/StrategyRules");


module.exports = class AnalyzeModule {

    constructor(pair, PositionModule){

        // Set trading pair
        this.pair = pair;

        // Actual Market Data
        this.marketData = undefined;

        this.currentAnalyze = undefined;

        this.WeekMatchingList = [];

        this.PatternsByLogicalGroup = {}

        this.PatternsByWorkingGroup = {}

        // Логическая группа по которой идет торговла
        this.ActiveLogicalGroup = undefined;

        this.ActiveWeekMatching = undefined;

        // Паттерны по которым сейчас идет работа или в очереди на торговлю
        this.ActivePatternsInWorkingGroup = undefined;

        this.positionModule = PositionModule

        this._UpdaterWeekMatchingList();

        this.POSITION = undefined;

    }

    clearCurrentPattern(){ this.currentAnalyze = undefined; }
  
  
    setActualPosition(POSITION = undefined){
      this.POSITION = POSITION;
      return this;
    }
  

    /**
     * Initial Global Market Analyze Function
     */
    async analyze(){

        
        // TODO + ЗАменить на год
        //console.log({last: this.marketData});
        //console.log({match: matching(this.marketData[10080][2])})
        let MICRO_WEEK_SITUATION_INDEX = matching(this.marketData[10080][2]).index;

        let MACRO_WEEK_SITUATION_INDEX = matrixMatching(this.marketData);

        // let MACRO_WEEK_SITUATION_INDEX = matrixMatching({
        //     '518400' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     },
        //     '259200' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     },
        //     '129600' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     },
        //     '86400' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     },
        //     '43200' : {
        //         '2' : {
        //             backPattern : [0,1,3],
        //             prevZone : 1,
        //             zone : 2
        //         }
        //     },
        //     '20160' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     },
        //     '10080' : {
        //         '2' : {
        //             backPattern : [1,2,3],
        //             prevZone : 1,
        //             zone : 0
        //         }
        //     }
        // });
        

        //console.log({MACRO_WEEK_SITUATION_INDEX, MICRO_WEEK_SITUATION_INDEX})

        
        if(!MICRO_WEEK_SITUATION_INDEX || !MACRO_WEEK_SITUATION_INDEX) return { CODE: 'ACTUAL'};

        //console.log({MACRO_WEEK_SITUATION_INDEX, MICRO_WEEK_SITUATION_INDEX})            


        
        

        let WeekMatchingFiltered = this.WeekMatchingList.filter(i => i.MACRO_WEEK_SITUATION_INDEX == MACRO_WEEK_SITUATION_INDEX && i.MICRO_WEEK_SITUATION_INDEX == MICRO_WEEK_SITUATION_INDEX).sort((a,b) => b.tradingVolume - a.tradingVolume)




        if(WeekMatchingFiltered.length == 0) return { CODE: 'ACTUAL'};
        //console.log(WeekMatchingFiltered)

        

        // Если никакая группировка не выбрана, или найденная группировка больше по объему - переключаемся
        if(!this.ActiveWeekMatching || this.ActiveWeekMatching.tradingVolume < WeekMatchingFiltered[0].tradingVolume){
            this.ActiveWeekMatching = WeekMatchingFiltered[0];

            // Надо деактивировать все паттерны не входящие в локальную группу
            await this._deactivatePatterntByExcludedLogicalGroup(this.ActiveWeekMatching.LOGICAL_GROUP);
        }

        

        
        

        // Надо определить, с каким паттерном дальше работаем
        // Для этого надо проверить каждый паттерн на возможность активации
        // Определили больший по объему паттерн активный
        // Если позиций нету - запоминаем текущий паттерн как основной для следущего входа
        // Если позиция есть - проверяем : если ли паттерн с большем объемом чем текущий
            // Если есть - запоминаем и ждем входа по нему
            // Если нету - работаем с паттерном по позиции (проверяем, есть ли условия для входа - отступ и условия входа)
        // Если совпадает условие входа (и отступ, если позиция открытая) - посылаем сигнал на покупку и обновляем инфу в БД

        // Getting all patterns in local group
        let patternsGroupInLogicalGroup = await this._getPatternGroupsByLogicalGroup(this.ActiveWeekMatching.LOGICAL_GROUP, true);

        
        
        //console.log({patternsGroupInLogicalGroup})

        // Temp variable to hold local groups patterns
        let patternsTempIds = [];
        

        if(this.marketData.startTime == 1680572100000){
                console.log({patternsGroupInLogicalGroup})            
        }

        // Loop every pattern for activate
        for (let index = 0; index < patternsGroupInLogicalGroup.length; index++) {

            const element = patternsGroupInLogicalGroup[index];
            
            let ActivateTriggers = groupByRules(
                element.PATTERN_TRIGGERs.filter((i) => i.type == "ACTIVATION")
            );

            let patternCompare = StrategyRules(this.marketData, ActivateTriggers, true, this.ma);

            if(patternCompare || element.status) patternsTempIds.push(element);

        }

        
        
        

        
        
        if(patternsTempIds.length == 0){
             // Тут остается проверить только текущую позицию на усреднение
             
             this.ActivePatternsInWorkingGroup = undefined;
             return { CODE: 'ACTUAL'}
        }else{

            await this._activateLocalGroups(patternsTempIds.map(i => i.id).filter(i => !i.status));
            await this._getPatternGroupsByLogicalGroup(this.ActiveWeekMatching.LOGICAL_GROUP, true);
            
        }
        let maxPatternByVolume = undefined;
        if(this.POSITION){
            maxPatternByVolume = patternsTempIds.sort((a,b) => b.PERCENT_OF_DEPOSIT - a.PERCENT_OF_DEPOSIT)[0];
        }else{
            maxPatternByVolume = patternsTempIds.sort((a,b) => a.PERCENT_OF_DEPOSIT - b.PERCENT_OF_DEPOSIT)[0];            
        }
         
        
        
        this.ActivePatternsInWorkingGroup = await this._getPatternGroupsByWorkinglGroup(maxPatternByVolume.WORKING_GROUP, true);

        

        // If there are trading patterns - check to activate       
        if(this.ActivePatternsInWorkingGroup.length == 0){
            // Тут остается проверить только текущую позицию на усреднение
            return { CODE: 'ACTUAL'}
        }

        // Определяем общий торговый депозит
        let TotalTradingVolume = await this._getTotalTradingVolume();

        

        // Депозит на текущую торговую группу
        let CurrentTradingVolume = this.ActiveWeekMatching.tradingVolume * TotalTradingVolume / 100;

        //console.log({CurrentTradingVolume, awmtv: this.ActiveWeekMatching.tradingVolume})
        
        if(!CurrentTradingVolume){
            // Тут остается проверить только текущую позицию на усреднение
            return { CODE: 'ACTUAL'}
        }

        
        
        let activePatternToForce = undefined;
        
        if(this.POSITION){
            activePatternToForce = this.ActivePatternsInWorkingGroup.filter(i => i.status).sort((a,b) => b.PART_OF_VOLUME - a.PART_OF_VOLUME)[0]
        }else{
            activePatternToForce = this.ActivePatternsInWorkingGroup.filter(i => i.status).sort((a,b) => a.PART_OF_VOLUME - b.PART_OF_VOLUME)[0]
        }

        let analyzeResponse = {
            CurrentTradingVolume,
            PartsForPatterns: this.ActivePatternsInWorkingGroup.reduce((prev, curr) => prev + curr.PART_OF_VOLUME, 0),
            Pattern: activePatternToForce,
            CODE: 'ANALYZE'
        }

        //console.log(analyzeResponse.Pattern.ACTIVE_GROUPs)

        this.currentAnalyze = analyzeResponse;

        return analyzeResponse;
        
        

        

        

        


        

        


        

    }

    /**
     * Function updates actual market data by lastKline
     * @param {*} lastKline 
     */
    updateMarketData(lastKline){

        this.marketData = lastKline;

        return this;
    }

    /**
     * Deactivating all patterns by logical GROUP
     * @param {*} LOGICAL_GROUP 
     */
    async _deactivatePatterntByExcludedLogicalGroup(LOGICAL_GROUP){
        console.log('_deactivatePatterntByExcludedLogicalGroup')
        return await db.models.Pattern.update({status: false}, {
            logging: true,
            where: {
                LOGICAL_GROUP: {
                    [Op.ne] : LOGICAL_GROUP
                }
            },
            include: [
                {
                    model: db.models.Pairs,
                    where: {
                        Name: this.pair
                    }
                }
            ]
        })

    }

    // Activating local groups
    async _activateLocalGroups(PATTERNIDs = []){

        if(PATTERNIDs.length == 0) return;

        return await db.models.Pattern.update({status: true}, {
            where: {
                id: {
                    [Op.in] : PATTERNIDs
                }
            }
        })

    }

    async _getPatternGroupsByWorkinglGroup(WORKING_GROUP, force = false){

      

        let result = await db.models.Pattern.findAll({
            where: {
                WORKING_GROUP
            },
            include: [
                {
                    model: db.models.Pairs,
                    where: {
                        Name: this.pair
                    }
                },
                {
                    model: db.models.PatternTrigger
                },
                {
                    model: db.models.ActiveGroups,
                    include: [
                        {
                            model: db.models.ActiveGroupTriggers
                        },
                        {
                            model: db.models.Rules
                        }
                    ]
                }
            ]
        });

        return result;

        

    }
    
    async _getPatternGroupsByLogicalGroup(LOGICAL_GROUP, force = false){

        
        let result = await db.models.Pattern.findAll({
            where: {
                LOGICAL_GROUP
            },
            include: [
                {
                    model: db.models.Pairs,
                    where: {
                        Name: this.pair
                    }
                },
                {
                    model: db.models.PatternTrigger
                }                
            ]
        });

        return result;
    }

    // Check PAtterns to activate in LOCAL GROUP
    async _checkPatternsGroupToActivateByLocalGroup(LOGICAL_GROUP){

    }

    async _getTotalTradingVolume(){

        // TODO - брать с сайта
        return 50000;

    }


    async _UpdaterWeekMatchingList(){ 

        this.WeekMatchingList = await db.models.WeekMatching.findAll();
        setTimeout(async () => this.WeekMatchingList = await db.models.WeekMatching.findAll(), 30000);

    }
}   









const groupByRules = (ACTIVE_GROUP_TRIGGERs) => {    
  
    let zoneRulesBB = getBBRulesIndexes();
  
    let rules = zoneRulesBB.map((i) => getBBRuleByIddex(i));
  
    let grouppedTriggers = rules.map((i) =>
      ACTIVE_GROUP_TRIGGERs.filter(
        (j) => j.sigma == i.sigma && j.intervals == i.intervals
      )
    );
  
    return grouppedTriggers.filter((i) => i.length > 0);
  };