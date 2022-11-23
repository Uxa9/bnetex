import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetDataDto } from './dto/get-data.dto';
import { Position, PositionDocument } from './shemas/position.schema';

@Injectable()
export class PositionsService {

    constructor(
        @InjectModel(Position.name) private PositionModel: Model<PositionDocument>
    ) { }

    async getPnlAndRoe(dto: GetDataDto) {
        const date = new Date().setMonth(new Date().getMonth() - dto.period);

        const positions = await this.PositionModel.find({
            enterTime: { $gte: date },
            closeTime: { $exists: true }
        },
            {},
            { sort: { 'enterTime': 1 } }
        );

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

        const positions = await this.PositionModel.find({
            enterTime: { $gte: date },
            closeTime: { $exists: true }
        });

        let res = [];

        positions.map(position => {

            const { positionEnters } = position;

            const lever = 10;

            const enters = positionEnters.map(enter => {
                return {
                    date: enter.time,
                    action: "purchase",
                    amount: enter.volumeUSDT * lever,
                    price: enter.buyPrice,
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
    }

    async getCurrentOpenPosition() {
        const position = await this.PositionModel.findOne(
            {
                closeTime: { $exists: false }
            },
            {},
            { sort: { 'enterTime': -1 } }
        );

        if (position) {
            return position;
        }

        return null;
    }

    async getLastClosedPosition() {
        return await this.PositionModel.findOne(
            {
                closeTime: { $exists: true }
            },
            {},
            { sort: { 'closeTime': -1 } }
        );
    }
}
