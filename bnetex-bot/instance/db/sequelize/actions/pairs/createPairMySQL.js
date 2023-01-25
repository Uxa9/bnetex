const db = require("../../dbseq")

module.exports = async (Name) => {
    let sameName = await db.models.Pairs.findOne({where: {Name}})
    
    if(sameName) throw new Error('Торговая пара уже существует');
    
    return await db.models.Pairs.create({Name, Status: true})
}