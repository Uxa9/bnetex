const db = require("../../dbseq")


module.exports = async (id, isGroups = false) => {
    
    if(!isGroups){
        return await db.models.PatternTrigger.destroy({ where: { id } });
    }else{
        return await db.models.ActiveGroupTriggers.destroy({ where: { id } });
    }
}