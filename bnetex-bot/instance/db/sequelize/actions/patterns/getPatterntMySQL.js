const db = require("../../dbseq")


module.exports = async (where) => {
    
    return await db.models.Pattern.findAll({
        include: [
            {
                model: db.models.ActiveGroups,                
                include: [
                    {
                        model: db.models.ActiveGroupTriggers
                    }
                ]
            },
            {
                model: db.models.PatternTrigger
            }
        ]
    , where, order: [
        [
            {model: db.models.ActiveGroups}, 'id', 'DESC'
        ]
    ]})
}