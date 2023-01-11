const db = require("../../dbseq")

const config = require('../../../../../config/config')();

const moment = require('moment');

module.exports = async (market__buy, totalDeposit, patternEnter, PAIR, sumOfStep, close, time) => {
    
    console.log('Creating SQL Position')
    

    

    let position = await db.models.Position.create({deposit: totalDeposit, enterTime: moment(time, 'x').toDate(), avegarePrice: market__buy.avgPrice, enterPrice: market__buy.avgPrice, positionType: 'LONG', status: true, pair: PAIR, volumeACTIVE: market__buy.cumQty, volumeUSDT: (parseFloat(market__buy.cumQuote)).toFixed(2), enterStep: 1, lastEnterPrice: market__buy.avgPrice, ACTIVEGROUPId : patternEnter })

    let volumeUSDT = position.volumeUSDT;

    if(!config.simulate){
        volumeUSDT = volumeUSDT / 10;
    }

    await db.models.PositionEnters.create({volume: position.volumeACTIVE, createdAt: moment(time, 'x').toDate(), volumeUSDT, step: position.enterStep, POSITIONId: position.id, close: market__buy.avgPrice})

    return position

    
    
}