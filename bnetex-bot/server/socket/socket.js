const { pnlTIcker$ } = require('../events/events');

const { debounceTime } = require("rxjs");
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

        io.in(users.map((i) => i.id)).emit("PNL_UPDATE", {
            pair: e.symbol,
            pnl: percent.toFixed(2)
        });


    })

    console.log("Запуск сокета")

    io.on('connection', (socket) => {
        socket.on('ticker', (data) => {
            socket.join(data.id);    
            users.push({
                id: data.id
            })        
        })
    })
}