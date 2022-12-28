const timeframeRules = require("./timeframeRules")


module.exports = (intervalsData) => {
    return intervalsData.sort((a,b) => timeframeRules(a.interval).singleMilliseconds - timeframeRules(b.interval).singleMilliseconds)[0]    
}