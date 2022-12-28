const _timeframeRules = {
    '1d': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 10,
        minLoad: 1900,
        singleMilliseconds: 86400000
    },
    '12h': {
        searchInterval: 1080,
        topCount: 10,
        frequency: 10,
        minLoad: 2500,
        singleMilliseconds: 43200000
    },
    '8h': {
        searchInterval: 1460,
        topCount: 80,
        frequency: 10,
        minLoad: 3000,
        singleMilliseconds: 28800000
    },
    '6h': {
        searchInterval: 1080,
        topCount: 60,
        frequency: 10,
        minLoad: 4000,
        singleMilliseconds: 21600000
    },
    '4h': {
        searchInterval: 1080,
        topCount: 40,
        frequency: 10,
        minLoad: 4000,
        singleMilliseconds: 14400000
    },
    '2h': {
        searchInterval: 1460,
        topCount: 20,
        frequency: 10,
        minLoad: 5000,
        singleMilliseconds: 7200000
    },
    '1h': {
        searchInterval: 1460,
        topCount: 20,
        frequency: 10,
        minLoad: 6000,
        singleMilliseconds: 3600000
    },
    '30m': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 10,
        minLoad: 6000,
        singleMilliseconds: 1800000
    },
    '15m': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 5,
        minLoad: 6000,
        singleMilliseconds: 900000
    },
    '5m': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 2,
        minLoad: 6000,
        singleMilliseconds: 300000
    },
    '3m': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 2,
        minLoad: 6000,
        singleMilliseconds: 180000
    },
    '1m': {
        searchInterval: 1460,
        topCount: 10,
        frequency: 1,
        minLoad: 8000,
        singleMilliseconds: 60000
    }
}

const defaultRules = {
    searchInterval: 1460,
    topCount: 10,
    frequency: 1,
}

const timeframeRules = (timeframe) => {
    return _timeframeRules[timeframe] != undefined ?
        _timeframeRules[timeframe] : defaultRules;

}

module.exports =  timeframeRules;