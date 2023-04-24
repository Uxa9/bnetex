const { Op } = require('sequelize');
var db = require('../../instance/db/sequelize/dbseq');

const moment = require('moment');

module.exports = {

    getByPeriod: async (from, to) => {

        let fromDate = moment(from, 'x').toISOString();

        let toDate = moment(to, 'x').toISOString();

        return await db.models.Position.findAll({
            where: {
                enterTime: { [Op.between]: [fromDate, toDate] },
                closeTime: { [Op.not]: null }
            },
            include: [
                {
                    model: db.models.PositionEnters
                }
            ]
        });
    },

    getByStartTime: async (startTime) => {
        
        let result = await db.models.Position.findAll({
            where: {
                enterTime: { [Op.gte]: moment(startTime, 'x').toDate() },
                closeTime: { [Op.is]: null }
            },
        })
        
        return result;

        
    }

}