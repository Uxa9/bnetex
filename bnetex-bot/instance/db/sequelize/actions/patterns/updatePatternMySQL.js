const db = require("../../dbseq")


module.exports = async (params, id) => {
    
    return await db.models.Pattern.update(params, {where: {
        id
    }})
}