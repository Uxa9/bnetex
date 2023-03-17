module.exports.CalcPrevZone = (rule, candlesticks) => {


    let data = [...candlesticks].sort((a,b) => b.startTime - a.startTime);

    let currentZone = data[0][rule.intervals][rule.sigma].zone

    let prevZone = undefined;
    

    for (let index = 0; (index < data.length && prevZone == undefined); index++) {
        const element = data[index];
        
        // if(!element[rule.intervals] || !element[rule.intervals][rule.sigma]){


        //     //console.log(`Проблема с индексом: ${index} | StartTime : ${element.startTime} | Ключи :  ${JSON.stringify(Object.keys(element))}`)

        //     //console.log(`Проблема с индексом: ${index-1} | StartTime : ${data[index-1].startTime} | Ключи :  ${JSON.stringify(Object.keys(data[index-1]))}`)
            
        //     console.log({rule})
        // }

        if(element[rule.intervals][rule.sigma].zone != currentZone){
            prevZone = element[rule.intervals][rule.sigma].zone;
        }
        
    }

    candlesticks[candlesticks.length-1][rule.intervals][rule.sigma]['prevZone'] = prevZone;

    // Поиск backPattern
    let backPattern = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(!element[rule.intervals] || backPattern.length == 3) break;
        if(element[rule.intervals][rule.sigma].zone != currentZone && !backPattern.includes(element[rule.intervals][rule.sigma].zone)){
            backPattern.push(element[rule.intervals][rule.sigma].zone)
        }
        
    }

    // Жоские правила
    if(currentZone == 0){
        backPattern = [1,2,3];
        prevZone = 1;
    }

    if(currentZone == 1 && backPattern.includes(0) && prevZone == 2){
        backPattern = [0,2,3];
    }


    if(currentZone == 2 && backPattern.includes(0) && prevZone == 1){
        backPattern = [0,1,3];
    }

    if(currentZone == 5 && prevZone == 3){
        backPattern = [2,3,4];
    }

    if(currentZone == 5 && prevZone == 4){
        backPattern = [2,3,4]
    }
    

    candlesticks[candlesticks.length-1][rule.intervals][rule.sigma]['backPattern'] = backPattern.sort((a,b) => a-b);

    
    return candlesticks;
}