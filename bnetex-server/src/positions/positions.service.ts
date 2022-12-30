import { HttpService } from '@nestjs/axios';
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
        @InjectModel(PositionEnters)
        private positionEntersRepository: typeof PositionEnters,
        private readonly httpService: HttpService,
    ) { }

    async getPnlAndRoe(dto: GetDataDto) {
        const date = new Date().setMonth(new Date().getMonth() - dto.period);

        // const positions = await this.positionRepository.findAll({
        //     where: {
        //         // enterTime: { $gte: date },
        //         closeTime: { [Op.ne]: null }
        //     },
        //     order: [['enterTime', "ASC"]]
        // });

        // const positions = await Promise.resolve(() => {
        //     this.httpService.post('http://localhost:3009/front/history', {
        //         periodMonth: 12
        //     }).subscribe((res) => {
        //         console.log(res);
        //         return res;
        //     });
        // })

        const positions = await new Promise((resolve, rej) =>
            this.httpService
                .post('http://localhost:3009/front/history', {
                    periodMonth: dto.period,
                })
                .subscribe((res) => {
                    resolve(res.data.response);
                }),
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


            let customAmount = amount / position.deposit;

            const lever = 10;

            const percent = position.percentProfit;

            const pnl = position.sumProfit * customAmount * lever;

            if (
                new Date(position.closeTime).getDate() !==
                new Date(dates[dates.length - 1]).getDate() &&
                new Date(position.closeTime).getMonth() !==
                new Date(dates[dates.length - 1]).getMonth()
            ) {
                const date = new Date(position.closeTime);
                dates.push(
                    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                );
                roeValues.push((roeValues[roeValues.length - 1] || 0) + percent);
                pnlValues.push(pnl);
            } else {
                roeValues[roeValues.length - 1] += percent;
                pnlValues[pnlValues.length - 1] += pnl;
            }

            acc += pnl;
        });

        return {
            dates,
            pnlValues,
            roeValues,
        };
    }

    async getHistoricalDataOrders(period: number) {

        const positions: any[] = await new Promise((resolve, rej) => this.httpService.post('http://localhost:3009/front/history', {
            periodMonth: period
        }).subscribe((res) => {
            resolve(res.data.response);
        }))

        let res = [];

        positions.map((position) => {
            const positionEnters = position.POSITION_ENTERs;

            const lever = 10;

            const enters = positionEnters.map((enter) => {
                return {
                    date: new Date(enter.createdAt),
                    action: 'purchase',
                    amount: enter.volumeUSDT * lever,
                    price: enter.close,
                    PNL: 0,
                };
            });

            res = [...res, ...enters];

            res.push({
                date: new Date(position.closeTime),
                action: position.positionType === 'LONG' ? 'sale' : 'purchase',
                amount: position.volumeUSDT * lever,
                price: position.closePrice,
                PNL: position.sumProfit * lever,
            });
        });

        return res;
    }

    async getTVdata(dto: any) {

        const positions: any[] = await new Promise((resolve, rej) => this.httpService.post('http://localhost:3009/front/history', {
            periodMonth: 12
        }).subscribe((res) => {
            resolve(res.data.response);
        }))

        let res = [];

        positions.map((position) => {
            const positionEnters = position.POSITION_ENTERs;

            const lever = 10;

            const enters = positionEnters.map((enter) => {
                return {
                    time: Number(new Date(enter.createdAt)) / 1000,
                    id: enter.id,
                    color: 'green',
                    text:'Покупка BTC',
                    label: 'B',
                    minSize: 14,
                    labelFontColor: '#ffffff',
                };
            });

            res = [...res, ...enters];

            res.push({
                time: Number(new Date(position.closeTime)) / 1000,
                id: position.id,
                color: 'red',
                text:'Продажа BTC',
                label: 'S',
                minSize: 14,
                labelFontColor: '#ffffff',
            });
        });

        return res;
    }

    async getCurrentOpenPosition() {
        const position = await this.positionRepository.findOne({
            where: {
                closeTime: null,
            },
            order: [['enterTime', 'DESC']],
        });

        if (position) {
            return position;
        }

        return null;
    }

    async getLastClosedPosition() {
        return await this.positionRepository.findOne({
            where: {
                closeTime: { [Op.ne]: null },
            },
            order: [['closeTime', 'DESC']],
        });
    }
}
