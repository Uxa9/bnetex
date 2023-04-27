const { pnlTIcker$ } = require('../events/events');

const { debounceTime, debounce, of, interval} = require('rxjs')

const getCurrentPositionMySQL = require('../../instance/db/sequelize/actions/positions/getCurrentPositionMySQL');


var users = [];

var lastRoeInfo = {};


module.exports = (server)  => {
    


    const io = require('socket.io')(server);

    interval(1000).subscribe(_ => {

        console.log({lastRoeInfo})

        Object.keys(lastRoeInfo).map(i => {
            let info = lastRoeInfo[i];
            
            if(info){
                io.emit("ROE_UPDATE", info);
            }else{
                io.emit("ROE_UPDATE", null);
            }
        })
        
    })

    pnlTIcker$.pipe().subscribe(async e => {
    
        

        let currentPosition = await getCurrentPositionMySQL({status: true, pair: e.symbol});
        

        if(!currentPosition){
            lastRoeInfo[e.symbol] = null;
            return;
        }

        let close = parseFloat(e.close).toFixed(2)

        let averagePrice = currentPosition.averagePrice;
        
        

        let percent = (close * 100 / averagePrice) - 100;


        lastRoeInfo[e.symbol] = {
            pair: e.symbol,
            roe: percent * 10,
            markPrice: close,
            position: currentPosition
        }


    })

    console.log("Запуск сокета")

    io.on('connection', (socket) => {
        console.log('Client is connected')
    })
}