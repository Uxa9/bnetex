import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PositionsService } from '../positions/positions.service';
import { UsersService } from '../users/users.service';
import { CreateTradeSessionDto } from './dto/create-session.dto';
import { InvestSession } from './invest-sessions.model';
import { User } from 'src/users/users.model';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InvestSessionsService {

    constructor(
        @InjectModel(InvestSession) private investSessionRepository: typeof InvestSession,
        @InjectModel(User) private usersRepository: typeof User,
        private userService: UsersService,
        private positionService: PositionsService,
        private readonly httpService: HttpService,
    ) { }

    async createSession(dto: CreateTradeSessionDto, user: User) {
        if (user.openTrade === true) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "USER_ALREADY_HAVE_OPEN_SESSION"
                },
                HttpStatus.FOUND
            );
        }

        if (user.investWallet < dto.amount) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "INVEST_WALLET_LOWER_THAN_AMOUNT"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        const session = await this.investSessionRepository.create({
            userId: user.id,
            tradeBalance: dto.amount,
            startSessionTime: new Date,
        });

        if (session) {
            await this.usersRepository.update({
                openTrade: true,
                investWallet: user.investWallet - dto.amount,
                tradeBalance: user.tradeBalance + dto.amount 
            }, { where: {id: user.id} });

            return {
                status: "SUCCESS",
                message: "SESSION_CREATED"
            };
        } else {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "SESSION_CREATION_FAILED"
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async stopSession(user: User) {
        if ( user.openTrade === false ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "USER_NOT_TRADING"
                },
                HttpStatus.NO_CONTENT
            );
        }

        const session = await this.investSessionRepository.findOne({
            where: {
                userId: user.id,
                stopSessionTime: null
            }
        });

        if ( !session ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "ACTIVE_SESSION_NOT_FOUND"
                },
                HttpStatus.NO_CONTENT
            );
        }
        
        // Если позиция в профите, забираем 50%;
        const sessionPnL = session.lastPnl > 0 ? session.lastPnl / 2 : session.lastPnl;

        // Получает актуальные позиции
        let actualPositions: any[] = await new Promise((resolve, reject) => {

            // Время начала сессии торговой
            let sessionStart = new Date(session.startSessionTime).getTime();
            this.httpService.get(`${process.env.BOT_URL}front/activePositions/${sessionStart}`).subscribe((res) => resolve(res.data))
        })

        // Считаем объемы которые надо продать
        let volumeToClose = actualPositions.map(i => {
            console.log({tradeBalance: session.tradeBalance, VA: i.volumeACTIVE, TD: i.totalDeposit})
            return {
                volumeToMarketSellBuy: session.tradeBalance * i.volumeACTIVE / i.totalDeposit,
                pair: i.pair,
                type: i.positionType == 'LONG' ? 'SELL' : 'BUY'
            }
        })

        let errorToClose = undefined;
        // Закрываем обьемы
        if(volumeToClose.length > 0){
            try {
                await new Promise((resolve, reject) => {
                    this.httpService.post(`${process.env.BOT_URL}front/closeVolumeMarket`, {volumeToClose, user: {email: user.email, tradeBalance: user.tradeBalance}}).subscribe((res) => resolve(res.data), err => {
                        if(err?.response?.data?.detail){
                            reject(err.response.data.detail)                    
                        }else{
                            reject('SERVER_ERROR')
                        }
                        
                    })
                })
            } catch(error) {
                throw new HttpException(
                    {
                        status: "ERROR",
                        message: error
                    },
                    HttpStatus.BAD_REQUEST
                );

            }
            
        }
        
        await Promise.all([
            this.usersRepository.update({
                openTrade: false,
                investWallet: user.investWallet + user.tradeBalance + (sessionPnL),
                tradeBalance: 0
            }, { where: {id: user.id} }),
            session.update({
                stopSessionTime: new Date
            })
        ]);

        return {
            status: "SUCCESS",
            message: "SESSION_STOPPED"
        };
    }

    async getUserActiveSession(user: User) {
        if ( user.openTrade === false ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "USER_NOT_TRADING"
                },
                HttpStatus.NO_CONTENT
            );
        }

        const session = await this.investSessionRepository.findOne({
            where: {
                userId: user.id,
                stopSessionTime: null
            }
        });

        if (!session) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "ACTIVE_SESSION_NOT_FOUND"
                },
                HttpStatus.NO_CONTENT
            );
        }

        return session;
    }

    async getAllUserSessions(id: number) {
        return await this.investSessionRepository.findAll({
            where: { userId: id },
            order: [
                ["startSessionTime", "ASC"]
            ]
        });
    }

    async acceptBotCallback() {
        const position = await this.positionService.getLastClosedPosition();

        if ( !position ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "CLOSED_SESSION_NOT_FOUND"
                },
                HttpStatus.NO_CONTENT
            );
        }

    }

    async getTotalInvestAmount() {
        const res = await this.investSessionRepository.findAll({
            where: {
                stopSessionTime: null
            },
        });

        return {
            sessions: res,
            totalAmount: res.reduce((acc, session) => acc + session.tradeBalance, 0),
        };
    }

    async getHistory(user: User) {
        const sessions = await this.investSessionRepository.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']],
            limit: 30,
        });

        const sessionsMap = new Map<number, InvestSession>();
        sessions.forEach((session) => {
            sessionsMap.set(session.id, session);
        });

        const sessionsFromBot = (await lastValueFrom(this.httpService
            .post(`${process.env.BOT_REST_URL}positions/positions-by-invest-sessions`, {
                investSessions: Array.from(sessionsMap.keys()),
            }))).data;

        if (!sessionsFromBot.length) {
            return {
                dates: [],
                pnl: [],
                roe: [],
                positions: [],
            }
        }
        
        let datesMap = new Map<string, number>();

        const lastEnters = sessionsFromBot[sessionsFromBot.length - 1].POSITION.POSITION_ENTERs;
        const curDate = new Date(lastEnters[lastEnters.length - 1].createdAt);
        let startDate = new Date(sessionsFromBot[0].POSITION.enterTime);

        while (
            startDate.getMonth() !== curDate.getMonth() ||
            startDate.getDate() !== curDate.getDate() ||
            startDate.getFullYear() !== curDate.getFullYear()
        ) {
            datesMap.set(startDate.toISOString().split('T')[0], datesMap.size);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }

        const pnl = Array(datesMap.size).fill(0);
        const roe = Array(datesMap.size).fill(0);
        const positions = [];
        let acc = 0;

        sessionsFromBot.forEach((session) => {
            const position = session.POSITION;
            const posCloseTime = new Date(position.closeTime);
            const index = datesMap.get(posCloseTime.toISOString().split('T')[0]);
            const userDeposit = sessionsMap.get(session.INVEST_SESSION_ID).tradeBalance;

            if (index !== undefined) {
                const rate = userDeposit / position.totalDeposit;
                
                const percent = position.sumProfit / position.totalDeposit;
                acc += percent * 100;

                pnl[index] += position.sumProfit * rate;
                roe[index] = acc;
            }

            const enters = position.POSITION_ENTERs;
            const percentOfTotalDeposit = userDeposit / position.totalDeposit;

            const mappedEnters = enters.map((enter) => {
                return {
                    date: new Date(enter.createdAt),
                    action: 'purchase',
                    amount: enter.volumeUSDT * percentOfTotalDeposit,
                    price: enter.close,
                    PNL: 0,
                };
            });

            positions.push(...mappedEnters, {
                date: new Date(position.closeTime),
                action: position.positionType === 'LONG' ? 'sale' : 'purchase',
                amount: position.volumeUSDT * percentOfTotalDeposit,
                price: position.closePrice,
                PNL: position.sumProfit * percentOfTotalDeposit,
            })
        });

        roe.slice(1).forEach((item, index) => {
            if (item === 0) {
                roe[index + 1] = roe[index];
            }
        });
        
        return {
            dates: Array.from(datesMap.keys()),
            pnl: pnl.map((el) => Number(el.toFixed(2))),
            roe: roe.map((el) => Number(el.toFixed(2))),
            positions,
        }
    }
}
