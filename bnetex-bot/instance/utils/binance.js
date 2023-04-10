const Binance = require('node-binance-api');
const configFile = require('../../config/config')();



// module.exports = new Binance().options({
//     APIKEY: configFile.binance.APIKEY,
//     APISECRET: configFile.binance.APISECRET,
//     reconnect: false,
//     test: configFile.binance.TEST,
//     family: 4
// });


module.exports = new Binance().options({
    APIKEY: '8f7b54d669216d815d2a9ec42700eecb5fd5e15b42fb3dfb598f7fb5355b39ea',
    APISECRET: '82edf111707a6332f5852483a3e4b2e5c0f844dc1dfca4bb3c2ef54d730533b5',
    reconnect: false,
    test: true
});



// 5642351090:AAEcNaA0oJgEW5u6cZrjdsgPTZDMZSWi47s