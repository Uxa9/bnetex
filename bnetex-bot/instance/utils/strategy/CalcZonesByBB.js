module.exports.CalcZonesByBB = (rule, candlesticks, lastclose = false, onlylast = false) => {
    
    
    for (let index = 0; index < candlesticks.length; index++) {

        if(onlylast){
            index = candlesticks.length-1;
        }

        const element = candlesticks[index];
        if(element[rule.intervals] && element[rule.intervals][rule.sigma]){
            let data = element[rule.intervals][rule.sigma];
            let upZone = data.upper;
            let downZone = data.lower;
            
            // Зоны
            let zones = [
                downZone,
                data.middle - (data.middle - downZone)/2,
                data.middle,
                data.middle + (upZone-data.middle)/2,
                upZone
            ]

            candlesticks[index][rule.intervals][rule.sigma]['zones'] = [...zones];

            
            
            if(index == candlesticks.length-1 && lastclose !== false){
                
                zones.push(parseFloat(lastclose));
                zones = zones.sort((a,b) => a - b);
                candlesticks[index][rule.intervals][rule.sigma]['zone'] = zones.indexOf(parseFloat(lastclose))                
                
            }else{

                zones.push(parseFloat(element.close));
                zones = zones.sort((a,b) => a - b);

                candlesticks[index][rule.intervals][rule.sigma]['zone'] = zones.indexOf(parseFloat(element.close))
                
            }
            
        }
    }

    return candlesticks;
}