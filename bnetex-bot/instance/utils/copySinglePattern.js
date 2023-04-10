const db = require("../db/sequelize/dbseq");




module.exports = async (LOGICAL_GROUP, NEW_LOGICAL_GROUP = "") => {

    let PATTERNS = await db.models.Pattern.findAll({
        where: {
            LOGICAL_GROUP
        }
    });

    

    //console.log({PATTERNS})

    for (let index = 1; index < PATTERNS.length+1; index++) {
        console.log({index})
        //if(index > 1) continue;

        const pattern = PATTERNS[index-1];

        //console.log(pattern)

        let WORKING_GROUP_INDEX = pattern.WORKING_GROUP[pattern.WORKING_GROUP.length-1];

        let NEW_WORKING_GROUP = `${NEW_LOGICAL_GROUP}_${WORKING_GROUP_INDEX}`;

        //console.log({NEW_WORKING_GROUP, NEW_LOGICAL_GROUP})

        let NEW_PATTERN = await db.models.Pattern.create({
            LOGICAL_GROUP: NEW_LOGICAL_GROUP,
            WORKING_GROUP: NEW_WORKING_GROUP,
            PART_OF_VOLUME: pattern.PART_OF_VOLUME,
            TRADINGPAIRId: 1,
            PERCENT_OF_DEPOSIT: pattern.PERCENT_OF_DEPOSIT,
            status: 0
        })



        let PATTERN_TRIGGERS = await db.models.PatternTrigger.findAll({
            where: {
                PATTERNId: pattern.id
            }
        });

        for (let index = 0; index < PATTERN_TRIGGERS.length; index++) {
            const trigger = PATTERN_TRIGGERS[index];

            await db.models.PatternTrigger.create({
                type: trigger.type,
                back: trigger.back,
                prev: trigger.prev,
                zone: trigger.zone,
                intervals: trigger.intervals,
                sigma: trigger.sigma,
                PATTERNId: NEW_PATTERN.id
            })
            
        }

        let ACTIVE_GROUPs = await db.models.ActiveGroups.findAll({
            where: {
                PATTERNId: pattern.id
            },
            include: [
                {
                    model: db.models.ActiveGroupTriggers
                },
                {
                    model: db.models.Rules
                }
            ]
        });

        

        for (let index = 0; index < ACTIVE_GROUPs.length; index++) {
            
            const ACTIVE_GROUP = ACTIVE_GROUPs[index];

            

            let NEW_ACTIVE_GROUP = await db.models.ActiveGroups.create({
                PATTERNId: NEW_PATTERN.id,
                ProfitPercent: ACTIVE_GROUP.ProfitPercent
            });

            for (let index = 0; index < ACTIVE_GROUP.ACTIVE_GROUP_TRIGGERs.length; index++) {

                const trigger = ACTIVE_GROUP.ACTIVE_GROUP_TRIGGERs[index];

                await db.models.ActiveGroupTriggers.create({
                    type: trigger.type,
                    back: trigger.back,
                    prev: trigger.prev,
                    zone: trigger.zone,
                    intervals: trigger.intervals,
                    sigma: trigger.sigma,
                    ACTIVEGROUPId: NEW_ACTIVE_GROUP.id
                });
                
            }


            for (let index = 0; index < ACTIVE_GROUP.POSITION_RULEs.length; index++) {

                const rule = ACTIVE_GROUP.POSITION_RULEs[index];

                await db.models.Rules.create({
                    depositPart: rule.depositPart,
                    priceDifferencePercent: rule.priceDifferencePercent,
                    positionIndex: rule.positionIndex,
                    ACTIVEGROUPId : NEW_ACTIVE_GROUP.id,                    
                });
                
            }

            
            
        }
        
    }

}