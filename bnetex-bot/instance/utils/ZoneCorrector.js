let moment = require("moment");

const timeframeRules = require("./timeframeRules");



// Doing correction of current TimeFrame zone by actual price of close
const zoneCorrector = (intervalsData = [], log = false) => {

    // Ищем самый минимальный таймфрейм
    let minimalTimeframe = Object.keys(intervalsData).sort((a,b) => timeframeRules(a).singleMilliseconds - timeframeRules(b).singleMilliseconds)[0]



    let close = parseFloat(intervalsData[minimalTimeframe][intervalsData[minimalTimeframe].length-1].close)

    

    let result = [];

    

    Object.keys(intervalsData).map(interval => {

        

        let lastKline = intervalsData[interval][intervalsData[interval].length-1]

        // Если таймфрейм минимальный - ничего не делаем
        if(minimalTimeframe == interval){
            result.push(lastKline);
            return;
        }

        let MMBs = [...lastKline.MMBs];

        MMBs.push(close);

        MMBs = MMBs.sort((a,b) => a-b)

        let zone = MMBs.indexOf(close);

        if(zone == 4 && lastKline.prevZone == [2,3,4]){
            prevZone
        }
        
        
        lastKline.zone = zone;

        // Если коррекция до третей зоны, правим BACK и PREV
        if(zone == 3 && JSON.stringify(lastKline.back) == JSON.stringify([0,1,3])){            
            
            lastKline = {
                ...lastKline,
                back: [0,1,2],
                prevZone: 2
            }
        }

        // Коррекция до нулевой зоны, правим BACK и PREV
        if(zone == 0){

            lastKline = {
                ...lastKline,
                back: [1,2,3],
                prevZone: 1
            }
        }


        if(zone == 5){

            lastKline = {
                ...lastKline,
                back: [2,3,4],
                prevZone: 4
            }
        }

        if(zone == 4 && lastKline.prevZone == 5){
            
            lastKline = {
                ...lastKline,
                back: [2,3,5],
                prevZone: 5
            }
        }

        if(zone == 2 && lastKline.prevZone == [0,1,2]){            

            lastKline = {
                ...lastKline,
                back: [0,1,3],
                prevZone: 1
            }
        }


        if(zone == 1 && lastKline.back.join() == [1,2,3].join() && lastKline.prevZone == 1){
            
            lastKline = {
                ...lastKline,
                back: [0,2,3],
                prevZone: 2
            }
        }



        if(zone == 4 && lastKline.back.join() == [1,2,3].join() && lastKline.prevZone == 2){
            
            lastKline = {
                ...lastKline,
                back: [1,2,3],
                prevZone: 3
            }
        }

        

        if(zone == 1 && lastKline.back.join() == [0,1,3].join() && lastKline.prevZone == 1){
                        
            lastKline = {
                ...lastKline,
                back: [0,2,3],
                prevZone: 2
            }            
        }



        if(zone == 2 && lastKline.back.join() == [0,2,3].join() && lastKline.prevZone == 2){
                        
            lastKline = {
                ...lastKline,
                back: [0,1,3],
                prevZone: 3
            }            
        }


        if(zone == 3 && lastKline.back.join() == [1,2,3].join() && lastKline.prevZone == 3){
                        
            lastKline = {
                ...lastKline,
                back: [1,2,4],
                prevZone: 4
            }            
        }

        result.push(lastKline);
    })

    
    return result;

}


module.exports = zoneCorrector;