const db = require("../../dbseq")


module.exports = async (where) => {
    
    return await db.models.Position.findAll({
        include: [            
            {
                model: db.models.Pattern
            }
        ]
    , where})
}