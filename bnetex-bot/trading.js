const db = require("./instance/db/sequelize/dbseq");
const InstanceClass = require("./instance/instanceMainClass");

const config = require("./config/config")();

const cors = require('cors')

const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const port = config.serverPort;

app.use(cors())

// Тут хранятся все экземпляры торговых классов
let pairInstances = [];

const frontRoutes = require('./server/routes/front-routes');
const paramsConverter = require("./server/routes/middlewares/paramsConverter");
const socket = require("./server/socket/socket");
const binance = require("./instance/utils/binance");

const server = require('http').createServer(app);





(async () => {


    // binance.futuresSubscribe('btcusdt@kline_1m', e => {
    //     console.log(e)
    // })

    await db.setup();

    // app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    app.use(paramsConverter);

    // Запускам сокет
    socket(server);

    server.listen(port, () => {
        console.log(`Server is listening port ${port}`)
    })

    app.use('/front', frontRoutes)


    


})()




!config.serverOnly && config.tradingPairs.map(pair => {

    // Создаем экземпляр класса торговой пары
    let instalceClass = new InstanceClass(pair);

    // Инициализация класса
    instalceClass.initializing();

    // Сохранение класса
    pairInstances.push(instalceClass);
})



