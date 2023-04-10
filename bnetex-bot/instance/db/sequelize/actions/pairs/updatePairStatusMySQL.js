const db = require("../../dbseq")

module.exports = async (id, Status) => {

    console.log({id, Status})

    return await db.models.Pairs.update({Status}, {where: {
        id
    }})

}