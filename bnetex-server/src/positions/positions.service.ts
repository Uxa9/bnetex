import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AxiosError } from 'axios';
// import { InjectModel } from '@nestjs/mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { Op } from 'sequelize';
// import { Position, PositionDocument } from './shemas/_position.schema';
import { Position } from './position.model';
import { PositionEnters } from './positionEnters.model';
import { rejects } from 'assert';

@Injectable()
export class PositionsService {
    constructor(
        // @InjectModel(Position.name) private PositionModel: Model<PositionDocument>
        @InjectModel(Position) private positionRepository: typeof Position,
        @InjectModel(PositionEnters)
        private positionEntersRepository: typeof PositionEnters,
        private readonly httpService: HttpService,
    ) { }

    async getPnlAndRoe(dto: any) {

        console.log({dto})

        const from = dto.from || new Date().valueOf();
        const to = dto.to || new Date().valueOf();

        const positions :any[] = await new Promise((resolve, reject) =>
            this.httpService
                .post('http://localhost:3009/front/history', {
                    from,
                    to
                })
                .subscribe((res) => {
                    resolve(res.data.response);
                }, err => {
                    console.log(err);
                    reject([]);
                }),
        );

        if (positions.length === 0) return {
            dates: [],
            pnlValues: [],
            roeValues: []
        }

        const result = await this.getHistoricalData(positions, dto.amount, from, to);

        return result;
    }

    async getHistoricalData(data: any, amount: number, from: number, to: number) {
        try {

            let dates = [];
            let acc = 0;

            const curDate = new Date(to);
            let startDate = new Date(from);

            while (startDate.getMonth() !== curDate.getMonth() ||
                startDate.getDate() !== curDate.getDate() ||
                startDate.getFullYear() !== curDate.getFullYear()
            ) {
                dates.push(
                    startDate.toISOString().split('T')[0]
                );

                startDate = new Date(startDate.setDate(startDate.getDate() + 1));
            }

            let pnlValues = Array(dates.length).fill(0);
            let roeValues = Array(dates.length).fill(0);

            data.map((position) => {
                // console.log(position);

                // let customAmountPercent = amount / position.deposit;

                // const lever = 10;

                // const pnl = position.sumProfit * customAmountPercent * lever;     

                const posCloseTime = new Date(position.closeTime);
                const index = dates.findIndex(item => item === posCloseTime.toISOString().split('T')[0]);

                if (index !== -1) {
                    const rate = amount / position.totalDeposit;
                    // console.log(rate);

                    const percent = position.sumProfit / position.totalDeposit;
                    acc += percent * 100;

                    // pnlValues[index] += pnl;
                    // roeValues[index] = acc;
                    // console.log(position.sumProfit * rate);

                    pnlValues[index] += position.sumProfit * rate;
                    roeValues[index] = acc;
                } else {
                    // бля, ну вообще странно
                }
            });

            roeValues.slice(1).map((item, index) => {
                if (item === 0) {
                    roeValues[index + 1] = roeValues[index];
                }
            });

            return {
                dates,
                pnlValues,
                roeValues,
            };
        } catch (error) {
            console.log('hist data');


            console.log(error);

        }
    }

    async getHistoricalDataOrders(period: number) {
        try {
            const to = new Date().valueOf();
            const from = new Date().setMonth(new Date().getMonth() - period)

            const positions: any[] = await new Promise((resolve, reject) => this.httpService.post('http://localhost:3009/front/history', {
                to,
                from
            }).subscribe((res) => {
                
                resolve(res.data.response);
            }, err => {
                
                console.log(err);
                reject([]);
            }))


            

            let res:any[] = [];

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

        } catch (error) {
            console.log('hist data orders');

            console.log(error);
        }
    }

    async getTVdata(dto: any) {
        try {
            const { data } = await firstValueFrom(this.httpService.post<any>(
                'http://localhost:3009/front/history', {
                from: dto.from || 1,
                to: dto.to || new Date().valueOf()
            }).pipe(
                catchError((error: AxiosError) => {
                    throw new HttpException(
                        {
                            status: "ERROR",
                            message: "ERROR_ON_DATA_REQUEST"
                        },
                        HttpStatus.BAD_REQUEST
                    );
                }),
            ));
            let res = [];

            data.response.map((position) => {
                const positionEnters = position.POSITION_ENTERs;

                const lever = 10;

                const enters = positionEnters.map((enter) => {
                    return {
                        time: Number(new Date(enter.createdAt)) / 1000,
                        id: enter.id,
                        color: 'green',
                        text: `Покупка BTC\nОбъём: ${enter.volumeUSDT}\nПо цене ${enter.close}`,
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
                    text: `Продажа BTC\nОбъём: ${position.volumeUSDT}\nПо цене ${position.closePrice}`,
                    label: 'S',
                    minSize: 14,
                    labelFontColor: '#ffffff',
                });
            });

            return res;
        } catch (error) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "ERROR_ON_DATA_REQUEST"
                },
                HttpStatus.BAD_REQUEST
            );
        }
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
