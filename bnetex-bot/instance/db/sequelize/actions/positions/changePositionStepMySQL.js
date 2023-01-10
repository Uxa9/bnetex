const db = require("../../dbseq")


module.exports = async (id, params) => {
    
    return await db.models.Position.update(params, {where: {id}})
    
}