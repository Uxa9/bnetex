const db = require("../../dbseq")

module.exports = async (pattern) => {

    return await db.models.ActiveGroups.findAll({where: {
        PATTERNId : pattern
    }, include: [
        {
            model: db.models.ActiveGroupTriggers,
            
        },
        {
            model: db.models.Rules
        }
    ]})
}