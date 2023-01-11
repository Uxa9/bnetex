const { pnlTIcker$ } = require('../events/events');


const getCurrentPositionMySQL = require('../../instance/db/sequelize/actions/positions/getCurrentPositionMySQL');


var users = [];


module.exports = (server)  => {


    const io = require('socket.io')(server);

    pnlTIcker$.subscribe(async e => {
    

        let currentPosition = await getCurrentPositionMySQL({status: true, pair: e.symbol});

        if(!currentPosition) return;

        let close = parseFloat(e.close).toFixed(2)

        let averagePrice = currentPosition.averagePrice;

        let percent = (close * 100 / averagePrice) - 100;

        console.log({close, averagePrice, percent})
        

        io.emit("ROE_UPDATE", {
            pair: e.symbol,
            roe: percent * 10,
            position: currentPosition
        });


    })

    console.log("Запуск сокета")

    io.on('connection', (socket) => {
        console.log('Client is connected')
    })
}