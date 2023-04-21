let moment = require("moment");

const timeframeRules = require("./timeframeRules");



// Doing correction of current TimeFrame zone by actual price of close
const zoneCorrector = (lastKline = [], log = false) => {


        

  

        let zone = lastKline.zone

        if(zone == 4 && lastKline.prevZone == [2,3,4]){
            prevZone
        }
        
    
        // Если коррекция до третей зоны, правим BACK и PREV
        if(zone == 3 && JSON.stringify(lastKline.backPattern) == JSON.stringify([0,1,3])){            
            
            lastKline = {
                ...lastKline,
                backPattern: [0,1,2],
                prevZone: 2
            }
        }

        // Коррекция до нулевой зоны, правим BACK и PREV
        if(zone == 0){

            lastKline = {
                ...lastKline,
                backPattern: [1,2,3],
                prevZone: 1
            }
        }


        if(zone == 5){

            lastKline = {
                ...lastKline,
                backPattern: [2,3,4],
                prevZone: 4
            }
        }

        if(zone == 4 && lastKline.prevZone == 5){
            
            lastKline = {
                ...lastKline,
                backPattern: [2,3,5],
                prevZone: 5
            }
        }

        if(zone == 2 && lastKline.backPattern == [0,1,2]){            

            lastKline = {
                ...lastKline,
                backPattern: [0,1,3],
                prevZone: 1
            }
        }





        if(zone == 1 && lastKline.backPattern.join() == [1,2,3].join() && lastKline.prevZone == 1){
            
            lastKline = {
                ...lastKline,
                backPattern: [0,2,3],
                prevZone: 2
            }
        }


        if(zone == 3 && lastKline.backPattern.join() == [2,3,5].join() && lastKline.prevZone == 3){
            
            lastKline = {
                ...lastKline,
                backPattern: [2,4,5],
                prevZone: 4
            }
        }


        if(zone == 1 && lastKline.backPattern.join() == [0,2,3].join() && lastKline.prevZone == 3){
            
            lastKline = {
                ...lastKline,
                backPattern: [0,2,3],
                prevZone: 2
            }
        }


        



        if(zone == 4 && lastKline.backPattern.join() == [1,2,3].join() && lastKline.prevZone == 2){
            
            lastKline = {
                ...lastKline,
                backPattern: [1,2,3],
                prevZone: 3
            }
        }

        

        if(zone == 1 && lastKline.backPattern.join() == [0,1,3].join() && lastKline.prevZone == 1){
                        
            lastKline = {
                ...lastKline,
                backPattern: [0,2,3],
                prevZone: 2
            }            
        }


        if(zone == 1 && lastKline.backPattern.join() == [2,3,4].join() && lastKline.prevZone == 3){
                        
            lastKline = {
                ...lastKline,
                backPattern: [2,3,4],
                prevZone: 2
            }            
        }

        if(zone == 4 && lastKline.backPattern.join() == [0,1,2].join() && lastKline.prevZone == 2){
                        
            lastKline = {
                ...lastKline,
                backPattern: [1,2,3],
                prevZone: 3
            }            
        }

        if(zone == 4 && lastKline.backPattern.join() == [2,3,4].join() && lastKline.prevZone == 4){
                        
            lastKline = {
                ...lastKline,
                backPattern: [1,2,3],
                prevZone: 3
            }            
        }




        if(zone == 2 && lastKline.backPattern.join() == [0,2,3].join() && lastKline.prevZone == 2){
                        
            lastKline = {
                ...lastKline,
                backPattern: [0,1,3],
                prevZone: 3
            }            
        }


        if(zone == 3 && lastKline.backPattern.join() == [1,2,3].join() && lastKline.prevZone == 3){
                        
            lastKline = {
                ...lastKline,
                backPattern: [1,2,4],
                prevZone: 4
            }            
        }

        
    

    
    return lastKline;

}


module.exports = zoneCorrector;