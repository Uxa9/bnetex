const db = require("../../db/db");
const Positions = require("../../db/schemes/positions/Positions");

module.exports.ChangePosition = async (position, params) => {
    
    let md = await db(Positions);    
    
    let data = await md.updateOne({_id: position._id}, {$set: params});
      
    return data;

      
  };

