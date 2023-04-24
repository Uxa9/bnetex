import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AxiosError } from 'axios';
// import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
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
        const positions = await new Promise((resolve, rej) =>
            this.httpService
                .post('http://localhost:3009/front/history', {
                    periodMonth: dto.period,
                })
                .subscribe((res) => {
                    resolve(res.data.response);
                }, err => {
                    console.log(err)
                }),
        );

        const result = await this.getHistoricalData(positions, dto.amount, dto.period);

        return result;
    }

    async getHistoricalData(data: any, amount: number, period: number = 1) {
        let dates = [];
        let acc = 0;

        const curDate = new Date();
        let startDate = new Date(new Date().setMonth(curDate.getMonth() - period));

        while (startDate.getMonth() !== curDate.getMonth() ||
            startDate.getDate() !== curDate.getDate() ||
            startDate.getFullYear() !== curDate.getFullYear()
        ) {
            dates.push(
                // `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
                startDate.toISOString().split('T')[0]
            );

            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }

        let pnlValues = Array(dates.length).fill(0);
        let roeValues = Array(dates.length).fill(0);

        data.map((position) => {           
            
            let customAmountPercent = amount / position.deposit;

            const lever = 10;

            const pnl = position.sumProfit * customAmountPercent * lever;     
            const percent = position.sumProfit / position.deposit * 100 * lever;

            const posCloseTime = new Date(position.closeTime);

            // const index = dates.findIndex(item => item === `${posCloseTime.getFullYear()}-${posCloseTime.getMonth() + 1}-${posCloseTime.getDate()}`);
            const index = dates.findIndex(item => item === posCloseTime.toISOString().split('T')[0]);

            // if (index === 45) return
            // if (index === 46) return
            // if (index === 47) return
            // if (index === 48) return

            if (index !== -1) {            
                acc += percent;

                pnlValues[index] += pnl;
                roeValues[index] = acc;
            } else {
                // бля, ну вообще странно
            }

        });

        roeValues.slice(1).map((item, index) => {   
            if (item === 0) {
                roeValues[index+1] = roeValues[index];
            }
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
        }, err => {
            console.log(err)
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

        try {
            const { data } = await firstValueFrom(this.httpService.post<any>(
                'http://localhost:3009/front/history', {
                periodMonth: dto.period || 6
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
