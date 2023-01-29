const db = require("../../dbseq")
const getPairsListMySQL = require("../pairs/getPairsListMySQL")


module.exports = async (where, pair) => {

    if(!where) where = {};

    if(pair){

        let pairs = await getPairsListMySQL();

        if(pairs.filter(i => i.Name == pair).length > 0){
            where['TRADINGPAIRId'] = pairs.filter(i => i.Name == pair)[0].id
        }

        
    }
    
    return await db.models.Pattern.findAll({
        include: [
            {
                model: db.models.ActiveGroups,                
                include: [
                    {
                        model: db.models.ActiveGroupTriggers
                    }
                ]
            },
            {
                model: db.models.PatternTrigger
            },
            {
                model: db.models.Pairs
            }
        ]
    , where, order: [
        [
            'id', 'DESC'
        ]
    ]})
}