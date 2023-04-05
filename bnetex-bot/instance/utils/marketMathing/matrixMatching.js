const matching = require("./matching");

const matrix = [
    {
        index: 1,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [1]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [1]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [1]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [1]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [1]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [2,3]
            }
        ]
        
    },

    // Index 2

    {
        index: 2,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [1]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [1]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [1]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [1]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [1]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
            }
        ]
        
    },


    // Index 3

    {
        index: 3,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [1]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [1,2]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [1,2,3]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [1]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [2]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3,4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
            }
        ]
        
    },


    // Index 4

    {
        index: 4,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [1]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [1,2]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [1,2,3]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [2]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [2,3,4,5,6,7,8,9]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3,4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
            }
        ]
        
    },



    // Index 22 

    {
        index: 22,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [2,3]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [4,5,6,7,8,9]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [4,5,6,7,8,9]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [4,5,6,7,8,9]
            }
        ]
        
    },


    // Index 23

    {
        index: 23,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [2,3]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [4,5,6,7,8,9]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [4,5,6,7,8,9]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3]
            }
        ]
        
    },


    // Index 24


    {
        index: 24,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [2,3]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [4,5,6,7,8,9]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [4,5,6,7,8,9]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
            }
        ]
        
    },


    // Index 25

    {
        index: 25,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [2,3]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [4,5,6,7,8,9]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [4,5,6,7,8,9]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [1,2,3]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3,4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
            }
        ]
        
    },


    // Index 26


    {
        index: 26,
        data: [
            { 
                // 360
                sigma: 2,
                intervals: 518400,
                variations: [2,3]
            },
            {
                // 180
                sigma: 2,
                intervals: 259200,
                variations: [4,5,6,7,8,9]
            },
            {
                // 90
                sigma: 2,
                intervals: 129600,
                variations: [4,5,6,7,8,9]
            },
            {
                // 60
                sigma: 2,
                intervals: 86400,
                variations: [1,2,3]
            },
            {
                // 30
                sigma: 2,
                intervals: 43200,
                variations: [2,3,4,5]
            },
            {
                // 14
                sigma: 2,
                intervals: 20160,
                variations: [1,2,3,4,5,6,7,8,9]
            },
            {
                // 7
                sigma: 2,
                intervals: 10080,
                variations: [1,2,3,4,5,6,7,8,9]
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
                
                
                //console.log(element.index, jelem.variations, matching(kline[jelem.intervals][jelem.sigma]).index)
                if(jelem.variations.includes(matching(kline[jelem.intervals][jelem.sigma]).index)){
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