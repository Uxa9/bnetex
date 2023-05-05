import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PositionsService } from '../positions/positions.service';
import { UsersService } from '../users/users.service';
import { CreateTradeSessionDto } from './dto/create-session.dto';
import { InvestSession } from './invest-sessions.model';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/users.model';

@Injectable({ scope: Scope.DEFAULT })
export class InvestSessionsService {

    constructor(
        @InjectModel(InvestSession) private investSessionRepository: typeof InvestSession,
        @InjectModel(User) private usersRepository: typeof User,
        private userService: UsersService,
        private positionService: PositionsService,
        private readonly httpService: HttpService,
        @Inject(REQUEST) private readonly Request: Request,
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
}
