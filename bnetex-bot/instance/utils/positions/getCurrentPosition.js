const mongoose = require("mongoose");




const db = require('../../db/db');
const Positions = require("../../db/schemes/positions/Positions");

module.exports.GetCurrentPositions = async (pair) => {    
    
    let patternsDB = await db(Positions);
    
    let data = await patternsDB.find({
        status: true,
        pair: pair
    });

    if(data.length == 0){
        return false;
    }else{
        return data[0];
    }
  };