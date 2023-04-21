var BB = require("technicalindicators").BollingerBands;

const CalcBollingerComplex = (rule, candlesticks, last = false) => {



    
  

    

    let intervals = rule.intervals;

    let rootIntervals = intervals;

    if(rootIntervals > 1440){
      
        intervals = rule.intervals / 60

    }


    

    if(last && rootIntervals > 1400){


            

      let candlesticksToCalc = [...candlesticks]

      
      
      candlesticksToCalc = candlesticksToCalc.slice(candlesticksToCalc.length - intervals, candlesticksToCalc.length);
      
      

      var input = {
        period: intervals,
        values: candlesticksToCalc.map((i) => parseFloat(i.close)),
        stdDev: rule.sigma,
      };
  
      
      
      
      let boll = BB.calculate(input);
      

      
      
      

      let beyonds = false;

      let object = {};

      object[rule.intervals] = candlesticksToCalc[candlesticksToCalc.length-1][rule.intervals] || {};

      object[rule.intervals][rule.sigma] = {...boll[boll.length-1]};

      candlesticksToCalc[candlesticksToCalc.length-1] = { ...candlesticksToCalc[candlesticksToCalc.length-1], ...object };

      
      
      let result =  [...candlesticks.slice(0, candlesticks.length - candlesticksToCalc.length), ...candlesticksToCalc];
      
      
      
      return result;

    }


    let candlesToCalc = [...candlesticks];


    if(last){
      candlesToCalc = candlesToCalc.slice(candlesToCalc.length-intervals-1, candlesToCalc.length);
    }
    
    
    var input = {
      period: intervals,
      values: candlesToCalc.map((i) => parseFloat(i.close)),
      stdDev: rule.sigma,
    };

    
          
    let adate = new Date();
    
    let boll = BB.calculate(input);

    
    

    

    let diff = candlesticks.length - boll.length;
    
    let i = 0;

    if(last){
      i = candlesticks.length-1;
      
      candlesticks = [...[...candlesticks].slice(0, candlesticks.length - candlesToCalc.length), ...candlesToCalc];
      
    }

    for (let index = i; index < candlesticks.length; index++) {
      
      

      if (index < diff) {        
        continue;
      }

      const element = candlesticks[index];

      let close = parseFloat(element.close);

      let beyonds = false;

      let object = {};

      object[rule.intervals] = element[rule.intervals] || {};

      if (close < boll[index - diff].lower) {
        beyonds = "lower";
      } else if (close > boll[index - diff].upper) {
        beyonds = "upper";
      }

      object[rule.intervals][rule.sigma] = {
        ...boll[index - diff],
        ...{ beyonds },
        ...{ bollindex: index - diff },
      };

      candlesticks[index] = { ...element, ...object };
      
    }

    let bdate = new Date();
    
    if(intervals == 60){
      //console.log("time:".red,  (bdate-adate)/1000)
    }
    

    return candlesticks;
  
};

module.exports.CalcBollingerComplex = CalcBollingerComplex;
