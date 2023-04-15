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

const server = require('http').createServer(app);





(async () => {

    

    //let klines = await getPairDataFromExchange('BTCUSDT', '1m', 1000, 1675242540000 + 60000);

    //console.log(klines[0].startTime - 1675242540000)

    await db.setup();

    //await dbValidator();

    //return;

    //await copySinglePattern('1D-LONG_1-7D_456789-30D_234-360D', '1D-LONG_9-7D_456789-30D_234-360D')

    /**
     * 	
     * 
        1д-лонг_(2)-7д_(456789)-30д_(234)-360д
        *1D-LONG_2-7D_456789-30D_234-360D

        1д-лонг_(3)-7д _(456789)-30д_(234)-360д
        *1D-LONG_3-7D_456789-30D_234-360D

        1д-лонг_(4)-7д_(456789)-30д_(234)-360д
        *1D-LONG_4-7D_456789-30D_234-360D

        1д-лонг_(5)-7д_(456789)-30д_(234)-360д
        *1D-LONG_5-7D_456789-30D_234-360D

        1д-лонг_(6)-7д_(456789)-30д_(234)-360д
        *1D-LONG_6-7D_456789-30D_234-360D

        1д-лонг_(7)-7д_(456789)-30д_(234)-360д
        *1D-LONG_7-7D_456789-30D_234-360D

        1д-лонг_(8)-7д_(456789)-30д_(234)-360д 
        *1D-LONG_8-7D_456789-30D_234-360D

        1д-лонг_(9)-7д_(456789)-30д_(234)-360д
        *1D-LONG_9-7D_456789-30D_234-360D
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











