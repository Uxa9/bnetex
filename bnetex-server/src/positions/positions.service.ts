import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Op } from 'sequelize';
import { GetDataDto } from './dto/get-data.dto';
// import { Position, PositionDocument } from './shemas/_position.schema';
import { Position } from './position.model';
import { PositionEnters } from './positionEnters.model';

@Injectable()
export class PositionsService {

    constructor(
        // @InjectModel(Position.name) private PositionModel: Model<PositionDocument>
        @InjectModel(Position) private positionRepository: typeof Position,
        @InjectModel(PositionEnters) private positionEntersRepository: typeof PositionEnters,
    ) { }

    async getPnlAndRoe(dto: GetDataDto) {
        const date = new Date().setMonth(new Date().getMonth() - dto.period);

        const positions = await this.positionRepository.findAll({
            where: {
                // enterTime: { $gte: date },
                closeTime: { [Op.ne]: null }
            },
            order: [['enterTime', "ASC"]]
        });

        console.log(positions[0]);
        


        const result = await this.getHistoricalData(positions, dto.amount);

        return result;
    }

    async getHistoricalData(data: any, amount: number) {

        let dates = [];
        let pnlValues = [];
        let roeValues = [];
        let acc = amount;

        data.map((position) => {

            const lever = 10;
            const percent = position.sumProfit / position.deposit * 100;
            const x = position.volumeUSDT / position.deposit * acc;
            const pnl = x * percent / 100 * lever;
            console.log(new Date(position.closeTime).getDate());
            
            

            if ( new Date(position.closeTime).getDate() !== 
                 new Date(dates[dates.length - 1]).getDate() &&
                 new Date(position.closeTime).getMonth() !== 
                 new Date(dates[dates.length - 1]).getMonth()
                ) {

                const date = new Date(position.closeTime);
                dates.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                roeValues.push((roeValues[roeValues.length - 1] || 0) + percent);
                pnlValues.push(pnl);
            } else {               
                roeValues[roeValues.length - 1]+= percent
                pnlValues[pnlValues.length - 1]+= pnl;
            }               

            // roeValues.push(roeValues[index - 1] + percent)
            //     pnlValues.push(pnlValues[index - 1] + percent);

            acc += pnl;
        });

        return {
            dates,
            pnlValues,
            roeValues
        }
    }

    async getHistoricalDataOrders(period: number) {
        const date = new Date().setMonth(new Date().getMonth() - period);

        const positions = await this.positionRepository.findAll({
            where: {
                enterTime: { $gte: date },
                closeTime: { [Op.ne]: null }
            }
            // include posEnters
        });

        let res = [];

        positions.map(position => {

            const { positionEnters } = position;

            const lever = 10;

            const enters = positionEnters.map(enter => {
                return {
                    date: enter.createdAt,
                    action: "purchase",
                    amount: enter.volumeUSDT * lever,
                    price: enter.close,
                    PNL: 0
                }
            });

            res = [...res, ...enters];

            res.push({
                date: position.closeTime,
                action: position.positionType === "LONG" ? "sale" : "purchase",
                amount: position.volumeUSDT * lever,
                price: position.closePrice,
                PNL: position.sumProfit * lever
            });
        });

        return res;
        return {};
    }

    async getCurrentOpenPosition() {

        const position = await this.positionRepository.findOne({
            where: {
                closeTime: null
            },
            order: [['enterTime', "DESC"]]
        });

        if (position) {
            return position;
        }

        return null;
    }

    async getLastClosedPosition() {
        return await this.positionRepository.findOne({
            where: {
                closeTime: { [Op.ne]: null }
            },
            order: [['closeTime', "DESC"]]
        });
    }
}
