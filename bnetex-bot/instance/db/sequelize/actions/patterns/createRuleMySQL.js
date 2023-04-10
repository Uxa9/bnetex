const db = require("../../dbseq")

module.exports = async (Params) => {

    return await db.models.Rules.create(Params)

}