const db = require("../db/sequelize/dbseq");

const colors = require('colors');


module.exports = async () => {

    let PATTERNS = await db.models.Pattern.findAll({
        include: [
            {
                model: db.models.ActiveGroups,
                include: [
                    {
                        model: db.models.Rules
                    }
                ]
            },
            {
                model: db.models.PatternTrigger
            }
        ]
    });

    // Check that every PATTERN has ACTIVE GROUP
    let PATTERNS_WITHOUT_ACTIVE_GROUP = [];

    let PATTERNS_WITHOUT_ACTIVATE_TRIGGER = [];

    // Проверяем что у каждой активной группы есть позиции на вход
    let ACTIVE_GROUPs = [];

    for (let index = 0; index < PATTERNS.length; index++) {
        const element = PATTERNS[index];

        ACTIVE_GROUPs = [...ACTIVE_GROUPs, ...element.ACTIVE_GROUPs]

        if(element.ACTIVE_GROUPs.length == 0){
            PATTERNS_WITHOUT_ACTIVE_GROUP.push(element)
        }
        
    }

    

    for (let index = 0; index < PATTERNS.length; index++) {
        const element = PATTERNS[index];

        if(element.PATTERN_TRIGGERs.filter(i => i.type == 'ACTIVATION').length == 0){
            PATTERNS_WITHOUT_ACTIVATE_TRIGGER.push(element)
        }
        
    }

    if(PATTERNS_WITHOUT_ACTIVE_GROUP.length > 0){
        console.log(`PATTERNS WITH ID ${PATTERNS_WITHOUT_ACTIVE_GROUP.map(i => i.id).join(':')} don't have active groups `.red);
        return;
    }


    // Check that all PATTERNS HAVE TRIGGER TO ACTIVATE
    if(PATTERNS_WITHOUT_ACTIVATE_TRIGGER.length > 0){
        console.log(`PATTERNS WITH ID ${PATTERNS_WITHOUT_ACTIVATE_TRIGGER.map(i => i.id).join(':')} don't have activate triggers `.red);
        return;
    }


    let ACTIVE_GROUPs_WITH_ERROR = [];
    

    for (let index = 0; index < ACTIVE_GROUPs.length; index++) {
        const element = ACTIVE_GROUPs[index];

        if(element.POSITION_RULEs.length == 0){
            ACTIVE_GROUPs_WITH_ERROR.push(element)
            continue;
        }

        let sumOfIndexes = element.POSITION_RULEs.length;
        let lastIndex = element.POSITION_RULEs.sort((a,b) => b.positionIndex - a.positionIndex)[0].positionIndex;

        if(sumOfIndexes != lastIndex){
            ACTIVE_GROUPs_WITH_ERROR.push(element);
        }        

        
        
    }

    if(ACTIVE_GROUPs_WITH_ERROR.length > 0){
        console.log(`ACTIVA GROUPS WITH ID ${ACTIVE_GROUPs_WITH_ERROR.map(i => i.id).join(':')} have errors `.red);
        return;
    }


    console.log('There are not errors'.green)
    


}