const mongoose = require("mongoose");


const patternScheme = require('../../db/schemes/patterns')

const db = require('../../db/db');

module.exports.UpdatePattern = async (id, params) => {    
    
    let patternsDB = await db(patternScheme);
    
    let data = await patternsDB.updateOne({_id: id}, {$set: params});

    return data;
  };