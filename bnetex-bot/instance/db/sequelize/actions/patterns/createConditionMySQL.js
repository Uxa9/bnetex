const db = require("../../dbseq")

module.exports = async (Params) => {
    
    
    return await db.models.PatternTrigger.create(Params)
}