const db = require("../../db/sequelize/dbseq")


module.exports = async (id) => {
    
    return await db.models.Rules.destroy({ where: { id } });
}