const db = require("../../db/db");
const Positions = require("../../db/schemes/positions/Positions");
const { GetCurrentPositions } = require("./getCurrentPosition")

module.exports = async (PAIR, close) => {

    let position = await GetCurrentPositions(PAIR);

    let md = await db(Positions);

    if(close < position.minPrice){

        let percent = 100 - (close * 100 / position.lastEnterPrice)

        await md.updateOne({_id: position._id}, {$set: {minPrice: close, minPricePercent: percent}})

    }

    

}