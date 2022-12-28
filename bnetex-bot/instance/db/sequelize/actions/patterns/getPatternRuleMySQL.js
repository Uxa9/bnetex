const db = require("../../dbseq")


module.exports = async (step, id) => {

    
    
    
    return await db.models.Rules.findOne({
        include: [
            {
                model: db.models.ActiveGroups,
                where: {id: id}
            }
        ]
    , where: {
        positionIndex: step
    }})
}