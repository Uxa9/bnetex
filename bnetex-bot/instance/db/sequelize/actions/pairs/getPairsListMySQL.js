const db = require("../../dbseq")


module.exports = async () => {
    return await db.models.Pairs.findAll({
        include: [
            {
                model: db.models.Pattern
            }
        ]
    })
}