const { Op } = require('sequelize');
var db = require('../../instance/db/sequelize/dbseq');

const moment = require('moment');

module.exports = {

    getByPeriod: async (periodInMonth = 6) => {

        const date = moment(new Date().setMonth(new Date().getMonth() - periodInMonth), 'x').startOf('day').toDate();

        return await db.models.Position.findAll({
            where: {
                enterTime: { [Op.gte]: date },
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

        return await db.models.Position.findAll({
            where: {
                enterTime: { [Op.gte]: moment(startTime, 'x').toDate() },
                closeTime: { [Op.not]: null }
            },
        })

        
    }

}