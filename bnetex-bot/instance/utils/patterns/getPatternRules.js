const db = require("../../db/db");
const PatternVariations = require("../../db/schemes/PatternVariations");
const PositionRules = require("../../db/schemes/positions/PositionRules");

module.exports.getPatternRules = async (step, pattern) => {

  let md = await db(PositionRules);

  let data = await md.find({ patternIndex: pattern, positionIndex: step });

  if (data.length == 0) {
    return false;
  } else {
    return data[0];
  }
  
};
