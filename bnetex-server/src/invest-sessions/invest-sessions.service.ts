import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PositionsService } from '../positions/positions.service';
import { UsersService } from '../users/users.service';
import { CreateTradeSessionDto } from './dto/create-session.dto';
import { InvestSession } from './invest-sessions.model';

@Injectable()
export class InvestSessionsService {

    constructor(
        @InjectModel(InvestSession) private investSessionRepository: typeof InvestSession,
        private userService: UsersService,
        private positionService: PositionsService,
        private readonly httpService: HttpService,
    ) { }

    async createSession(dto: CreateTradeSessionDto) {
        const user = await this.userService.getUserById(dto.userId);

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
            userId: dto.userId,
            tradeBalance: dto.amount,
            startSessionTime: new Date,
        });

        if (session) {
            await user.update({
                openTrade: true,
                investWallet: user.investWallet - dto.amount,
                tradeBalance: user.tradeBalance + dto.amount 
            });

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

    async stopSession(id: number) {
        const user = await this.userService.getUserById(id);

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
                userId: id,
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
            
            this.httpService.get(`http://localhost:3009/front/activePositions/${sessionStart}`).subscribe((res) => resolve(res.data))
        })
        
        

        

        // Считаем объемы которые надо продать
        let volumeToClose = actualPositions.map(i => {
            return {
                volumeToMarketSellBuy: i.volumeACTIVE * session.tradeBalance / i.deposit,
                pair: i.pair,
                type: i.positionType == 'LONG' ? 'SELL' : 'BUY'
            }
        })

        

        
        // Закрываем обьемы
        if(volumeToClose.length > 0){
            await new Promise((resolve, reject) => {
                this.httpService.post('http://localhost:3009/front/closeVolumeMarket', {volumeToClose, user: {email: user.email, tradeBalance: user.tradeBalance}}).subscribe((res) => resolve(res.data))
            })
        }
        

        
        
        await Promise.all([

            user.update({
                openTrade: false,
                investWallet: user.investWallet + user.tradeBalance + (sessionPnL),
                tradeBalance: 0
            }),
            session.update({
                stopSessionTime: new Date
            })
        ]);

        return {
            status: "SUCCESS",
            message: "SESSION_STOPPED"
        };
    }

    async getUserActiveSession(id: number) {
        const user = await this.userService.getUserById(id);

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
                userId: id,
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

        return session;
    }

    async getAllUserSessions(id: number) {
        await this.userService.getUserById(id);

        return await this.investSessionRepository.findAll({
            where: {
                userId: id
            },
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
}
