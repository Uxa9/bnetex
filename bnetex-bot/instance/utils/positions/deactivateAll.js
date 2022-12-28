

const db = require("../../db/db");
const patterns = require("../../db/schemes/patterns");
const Positions = require("../../db/schemes/positions/Positions");


module.exports = async () => {    
    
    let md = await db(patterns);
    
    let data = await md.updateMany({groupIndex: {
        $gte: 0
    }}, {$set: {status: false}});

    return data;
  };