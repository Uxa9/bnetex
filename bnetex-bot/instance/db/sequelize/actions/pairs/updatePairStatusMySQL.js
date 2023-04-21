const db = require("../../dbseq")

module.exports = async (id, Status) => {

    
    return await db.models.Pairs.update({Status}, {where: {
        id
    }})

}