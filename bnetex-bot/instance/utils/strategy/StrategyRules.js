var moment = require("moment");



const StrategyRules = (intervalsData, triggers = [], groupped = false, log = false) => {

    if(!groupped) return calcOneGroupd(triggers, intervalsData);
      
    
    return triggers.map(i => calcOneGroupd(i, intervalsData, log) ).filter(i => i).length == triggers.length;
  

};



let calcOneGroupd = (triggers, intervalsData, log = false) => {
  

  
  
  let signal = false;
  
  for (let index = 0; index < triggers.length; index++) {
    const element = triggers[index];

    
    
    if(intervalsData[element.intervals] && intervalsData[element.intervals][element.sigma]){
      
      let actual = intervalsData[element.intervals][element.sigma]
      log && console.log(element.intervals, ':', element.sigma)
      log && console.log({ezone: element.zone, azone:  actual.zone, eback:  element.back, aback:  actual.backPattern.join(""), eprev: element.prev, aprev: actual.prevZone})
      if(element.zone == actual.zone && element.back == actual.backPattern.join("") && element.prev == actual.prevZone){
        signal = true;
      }
      
    }
  }
  log && console.log({signal})
  return signal;

}

module.exports = StrategyRules;
