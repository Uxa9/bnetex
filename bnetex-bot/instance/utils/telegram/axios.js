var axios = require('axios');

const binhistoryspotkline = axios.create({
    baseURL: 'https://data.binance.vision/data/spot/monthly/klines',
    timeout: 9000,
    responseType: "stream"
})


const calcHost = axios.create({
    baseURL: 'http://localhost:4800',
    timeout: 3000
})

const tg = axios.create({
    baseURL: 'https://api.telegram.org',
    timeout: 30000
});


const api = axios.create({
    baseURL: 'https://api.bnetex.com',
    timeout: 30000
});

module.exports.binhistoryspotkline = binhistoryspotkline;
module.exports.calcHost = calcHost;
module.exports.tg = tg;
module.exports.api = api;