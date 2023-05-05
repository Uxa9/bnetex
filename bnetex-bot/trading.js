const db = require("./instance/db/sequelize/dbseq");
const InstanceClass = require("./instance/instanceMainClass");

const config = require("./config/config")();

const cors = require('cors')

const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const port = config.serverPort;

const events = require('./instance/utils/events');


app.use(cors())

// Тут хранятся все экземпляры торговых классов
let pairInstances = [];

const frontRoutes = require('./server/routes/front-routes');
const paramsConverter = require("./server/routes/middlewares/paramsConverter");
const socket = require("./server/socket/socket");
const getPairsListMySQL = require("./instance/db/sequelize/actions/pairs/getPairsListMySQL");
const TelegramBotClass = require("./instance/utils/telegram/bot");
const dbValidator = require("./instance/utils/dbValidator");
const copySinglePattern = require("./instance/utils/copySinglePattern");
const { sendMessageToMainChanel } = require("./instance/utils/telegram/tg");
const getPairDataFromExchange = require("./instance/utils/getPairDataFromExchange");
const LocalStore = require("./instance/utils/LocalStore");
const binance = require("./instance/utils/binance");
const FuturesModule = require("./instance/classes/FuturesModule");
const PositionsModule = require("./instance/classes/PositionsModule");
const server = require('http').createServer(app);





(async () => {


    

    

    //let klines = await getPairDataFromExchange('BTCUSDT', '1m', 1000, 1675242540000 + 60000);

    //console.log(klines[0].startTime - 1675242540000)

    

    // let hist = await binance.futuresHistDataId(
    //     "BTCUSDT", {
    //       startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    //       endTime: new Date().getTime(),
    //       dataType: 'T_TRADE'
    // });

    //let positions = new PositionsModule("BTCUSDT");
    //let futures = new FuturesModule("BTCUSDT", positions);

    // let mb = await futures.marketBuy(0.001);


    // let response = await binance.publicRequest('https://fapi.binance.com/fapi/v1/klines', {
    //     symbol: 'BTCUSDT',
    //     interval: "1m",
    //     startTime: 1683014400000,    
    // });

    // console.log(response)

    /**
     * 
     * publicRequest( base + 'v3/klines', params, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
     */



    // let dataFromExhange = await getPairDataFromExchange(
    //     "BTCUSDT",
    //     "1m",
    //     1000,
    //     1683014400000
    //   );

    //console.log(dataFromExhange[dataFromExhange.length-1])
  

    

    //return;

    await db.setup();

    //await dbValidator();

    //return;

    //await copySinglePattern('1D_LONG_1_7D_45-30D_23-360D', '1_123_234_1D_LONG_1_7D_123_30D_234_360D')

    //return;

    /**
     * 	
     * 
     *  
     * 
     * 
        
        (1_123_234)_1д-лонг_(1)-7д_(123)-30д_(234)-360д
        1_123_234_1D_LONG_1_7D_123_30D_234_360D
    
        1д-лонг_(1)-7д_(45)-30д_(23)-360д
        1D_LONG_1_7D_45-30D_23-360D

        1д-лонг_(2)-7д_(45)-30д_(23)-360д
        1D_LONG_2_7D_45_30D_23_360D


        1д-лонг_(3)-7д _(45)-30д_(34)-360д
        *1D_LONG_3_7D_45_30D_34_360D


        1д-лонг_(4)-7д_(45)-30д_(23)-360д
        *1D_LONG_4_7D_45_30D_23_360D


        1д-лонг_(5)-7д_(45)-30д_(23)-360д
        *1D_LONG_5_7D_45_30D_23_360D



        1д-лонг_(6)-7д_(45)-30д_(23)-360д
        *1D_LONG_6_7D_45_30D_23_360D




        1д-лонг_(7)-7д_(45)-30д_(23)-360д
        *1D_LONG_7_7D_45_30D_23_360D




        1д-лонг_(8)-7д_(45)-30д_(23)-360д 
        *1D_LONG_8_7D_45_30D_23_360D 



        1д-лонг_(9)-7д_(45)-30д_(23)-360д 
        *1D_LONG_9_7D_45_30D_23_360D 




        1д-лонг_(1)-7д_(6789)-30д_(23)-360д
        *1D_LONG_1_7D_6789_30D_23_360D



        1д-лонг_(2)-7д_(6789)-30д_(23)-360д
        *1D_LONG_2_7D_6789_30D_23_360D



        1д-лонг_(3)-7д_(6789)-30д_(23)-360д
        *1D_LONG_3_7D_6789_30D_23_360D



        1д-лонг_(4)-7д_(6789)-30д_(23)-360д 
        *1D_LONG_4_7D_6789_30D_23_360D 



        1д-лонг_(5)-7д_(6789)-30д_(23)-360д
        *1D_LONG_5_7D_6789_30D_23_360D



        1д-лонг_(6)-7д_(6789)-30д_(23)-360д
        *1D_LONG_6_7D_6789_30D_23_360D



        1д-лонг_(7)-7д_(6789)-30д_(23)-360д
        *1D_LONG_7_7D_6789_30D_23_360D



        1д-лонг_(8)-7д_(6789)-30д_(23)-360д
        *1D_LONG_8_7D_6789_30D_23_360D



        1д-лонг_(9)-7д_(6789)-30д_(23)-360д
        *1D_LONG_9_7D_6789_30D_23_360D
     */

        

    

    // app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    app.use(paramsConverter);

    // Запускам сокет
    socket(server);

    server.listen(port, () => {
        console.log(`Server is listening port ${port}`)
    })

    app.use('/front', frontRoutes)


    let pairs = await getPairsListMySQL()


    // https://miro.com/welcomeonboard/ZjRmYnhVNTd2VXo4aXJpWGdKSXdZNTV6N2ZoMVZ6MXJpcUF3cHRpVkFncUliY1JSS2FsVTNXN2pYd3NGSXdZcHwzNDU4NzY0NTQ4NTg4NjQ2OTQzfDI=?share_link_id=783306334573
    
    !config.serverOnly && pairs.filter(i => i.Status).map(i => i.Name).map(pair => {        

        // Создаем экземпляр класса торговой пары
        let instalceClass = new InstanceClass(pair);
    
        // Инициализация класса
        instalceClass.initializing();
    
        // Сохранение класса
        pairInstances.push(instalceClass);
    })
    

    if (config.initTelgram) {
        this.tgClass = new TelegramBotClass(config.tgBotKey);
        this.tgClass.init();
      }


    


})()











