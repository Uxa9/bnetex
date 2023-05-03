import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { Op } from 'sequelize';
import { Position } from './position.model';
import { GetPositionsDto } from './dto/get-positions.dto';

@Injectable()
export class PositionsService {
    constructor(
        @InjectModel(Position) private positionRepository: typeof Position,
        private readonly httpService: HttpService,
    ) { }

    async getPnlAndRoe(dto: any) {
        const from = dto.from || new Date().valueOf();
        const to = dto.to || new Date().valueOf();

        const positions: any[] = (await lastValueFrom(this.httpService
            .post(`${process.env.BOT_URL}front/history`, {
                from,
                to
            }))).data.response;

        if (positions.length === 0) return {
            dates: [],
            pnl: [],
            roe: []
        }

        const result = await this.getHistoricalData(positions, dto.amount, from, to);

        return result;
    }

    async getHistoricalData(data: any, amount: number, from: number, to: number) {
        let dates = [];
        let acc = 0;

        const curDate = new Date(to);
        let startDate = new Date(from);

        while (startDate.getMonth() !== curDate.getMonth() ||
            startDate.getDate() !== curDate.getDate() ||
            startDate.getFullYear() !== curDate.getFullYear()
        ) {
            dates.push(startDate.toISOString().split('T')[0]);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }

        let pnl = Array(dates.length).fill(0);
        let roe = Array(dates.length).fill(0);

        data.forEach((position) => {
            const posCloseTime = new Date(position.closeTime);
            const index = dates.findIndex(item => item === posCloseTime.toISOString().split('T')[0]);

            if (index !== -1) {
                const rate = amount / position.totalDeposit;

                const percent = position.sumProfit / position.totalDeposit;
                acc += percent * 100;

                pnl[index] += position.sumProfit * rate;
                roe[index] = acc;
            }
        });

        roe.slice(1).forEach((item, index) => {
            if (item === 0) {
                roe[index + 1] = roe[index];
            }
        });

        return {
            dates,
            pnl: pnl.map(it => Number(it.toFixed(2))),
            roe: roe.map(it => Number(it.toFixed(2))),
        };
    }

    async getHistoricalDataOrders(dto: GetPositionsDto) {
        console.log(dto);
        
        const to = new Date().valueOf();
        const from = new Date().setMonth(new Date().getMonth() - dto.monthsCount)

        const positions: any[] = (await lastValueFrom(this.httpService
            .post(`${process.env.BOT_URL}front/history`, {
                from,
                to
            }))).data.response;

        let res:any[] = [];

        positions.map((position) => {
            const positionEnters = position.POSITION_ENTERs;

            const percentOfTotalDeposit = dto.amount / position.totalDeposit;

            const enters = positionEnters.map((enter) => {
                return {
                    date: new Date(enter.createdAt),
                    action: 'purchase',
                    amount: enter.volumeUSDT * percentOfTotalDeposit,
                    price: enter.close,
                    PNL: 0,
                };
            });

            res = [...res, ...enters];

            res.push({
                date: new Date(position.closeTime),
                action: position.positionType === 'LONG' ? 'sale' : 'purchase',
                amount: position.volumeUSDT * percentOfTotalDeposit,
                price: position.closePrice,
                PNL: position.sumProfit * percentOfTotalDeposit,
            });

        });

        return res;
    }

    async getTVdata(dto: any) {
        try {
            const { data } = await firstValueFrom(this.httpService.post<any>(
                `${process.env.BOT_URL}front/history`, {
                from: dto.from || 1,
                to: dto.to || new Date().valueOf()
            }).pipe(
                catchError((error: AxiosError) => {
                    console.log(error);
                    
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
