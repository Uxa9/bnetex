const Binance = require('node-binance-api');
const configFile = require('../../config/config')();



module.exports = new Binance().options({
    APIKEY: configFile.binance.APIKEY,
    APISECRET: configFile.binance.APISECRET,
    reconnect: false,
    test: configFile.binance.TEST,
    family: 4
});


// module.exports = new Binance().options({
//     APIKEY: '5e63bee577ad722eb0eec732663337cf823f4427e094b658829f3f5440a7f22f',
//     APISECRET: 'ffd9fd82eb2ad6b399f19102ca5140122f09b6cca9cffdc7037b8b0ccc7cf0c6',
//     reconnect: false,
//     test: true
// });



// 5642351090:AAEcNaA0oJgEW5u6cZrjdsgPTZDMZSWi47s