const timeframeRules = require("./timeframeRules");

const moment = require("moment");
const { getRulesMoreIntervals } = require("./BollZoneRules");

// Сращиваем 1м и 15м
module.exports = (c1m, c15m, onlylast = false) => {
  
  

  let moreIntervals = getRulesMoreIntervals(1440);

  

  if (onlylast) {
    moreIntervals.map((i) => {
      if (  c15m[c15m.length - 1][i.intervals] &&
        c15m[c15m.length - 1][i.intervals][i.sigma]
      ) {
        let object = {};
        object[i.intervals] = c1m[c1m.length - 1][i.intervals] || {};

        object[i.intervals][i.sigma] =
          c15m[c15m.length - 1][i.intervals][i.sigma];

        c1m[c1m.length - 1] = {
          ...c1m[c1m.length - 1],
          ...object,
        };

        
      }
    });
    
    return c1m;
  }

  for (let index = 0; index < c1m.length; index++) {
    const element = c1m[index];

    let sms = timeframeRules("1m").singleMilliseconds;

    let startTime = element.startTime;

    let endTime = element.startTime + sms * 60;

    let filtered = c15m.filter(
      (i) =>
        i.startTime <= element.startTime && i.endTime + 1 > element.startTime
    );

    if (filtered.length > 0) {
      moreIntervals.map((i) => {        
        if (c15m[index][i.intervals] && c15m[index][i.intervals][i.sigma]) {
          let object = {};
          object[i.intervals] = element[i.intervals] || {};

          object[i.intervals][i.sigma] = c15m[index][i.intervals][i.sigma];

          c1m[index] = {
            ...element,
            ...object,
          };
        }
      });
    } else {
      moreIntervals.map((i) => {
        if (
          c15m[c15m.length - 1][i.intervals] &&
          c15m[c15m.length - 1][i.intervals][i.sigma]
        ) {
          let object = {};
          object[i.intervals] = element[i.intervals] || {};

          object[i.intervals][i.sigma] =
            c15m[c15m.length - 1][i.intervals][i.sigma];

          c1m[index] = {
            ...element,
            ...object,
          };
        }
      });
    }
  }

  

  return c1m;
};
