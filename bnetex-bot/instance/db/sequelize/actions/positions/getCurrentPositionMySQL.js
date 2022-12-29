const db = require("../../dbseq")


module.exports = async (where) => {
    
    return await db.models.Position.findOne({
        include: [            
            {
                model: db.models.ActiveGroups,
                include: [
                    {
                        model: db.models.ActiveGroupTriggers
                    }
                ]
            }
        ]
    , where})
}