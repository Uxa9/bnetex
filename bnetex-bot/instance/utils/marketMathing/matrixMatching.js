const matrix = [
    {
        index: 1,
        data: [
            // { 
            //     // 360
            //     sigma: 2,
            //     intervals: 518400,
            //     variations: [1]
            // },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [1,2,3,4,5]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [1,2,3,4,5]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [1,2,3,4,5]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [1,2,3,5,4]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3,4,5]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [2,3,4,0,1,5]
            }
        ]
        
    }
]


module.exports = (kline) => {
    
    let indexex = [];

    for (let index = 0; index < matrix.length; index++) {
        
        const element = matrix[index];

        let matchingCount = 0;

        for (let i = 0; i < element.data.length; i++) {

            const jelem = element.data[i];

            if(kline[jelem.intervals] && kline[jelem.intervals][jelem.sigma]){
                
                
                //console.log(element.index, jelem.variations, kline[jelem.intervals][jelem.sigma].zone)
                if(jelem.variations.includes(kline[jelem.intervals][jelem.sigma].zone)){
                    matchingCount++;
                }

            }
            
        }

        //console.log({matchingCount})

        if(matchingCount == element.data.length) indexex.push(element.index);
        
    }

    if(indexex.length == 0) return null;

    return indexex.sort((a,b) => a - b)[0];
}