import { BaseController } from "../../modules/base.controller.js";
import { models } from "../../modules/db/sequelize/dbseq.js";

export default class PatternController extends BaseController {
    constructor(req: any,res: any){
        super(req,res)
    }


    public getName(){
        return 'RESSUUUUUUUUUUUULE'
    }

    public async getLogicalGroups(){

        let groups = await models.Pattern.findAll({
            attributes: ['LOGICAL_GROUP'],
            group: ['LOGICAL_GROUP']
        })

        return groups.map((i: {LOGICAL_GROUP: string}) => i.LOGICAL_GROUP)

    }

    public async listBySymbol(){

        return await models.Pattern.findAll({
            include: [
                {
                    model: models.Pairs,
                    where: {
                        name: this.queryParams.symbol
                    }
                }
            ]
        })
    }

    public async listByWorkingGroup(){

        return await models.Pattern.findAll({
            include: [
                {
                    model: models.Pairs,
                    where: {
                        name: this.queryParams.symbol
                    }
                }
            ],
            where: {
                WORKING_GROUP: this.queryParams.WORKING_GROUP
            }
        })
    }


    public async listByLogicalGroup(){

        return await models.Pattern.findAll({
            include: [
                {
                    model: models.Pairs,
                    where: {
                        name: this.queryParams.symbol
                    }
                }
            ],
            where: {
                LOGICAL_GROUP: this.queryParams.LOGICAL_GROUP
            }
        })
    }
    
}