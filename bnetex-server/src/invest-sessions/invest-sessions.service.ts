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

        await Promise.all([
            user.update({
                openTrade: false,
                investWallet: user.investWallet + user.tradeBalance,
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
        console.log('пошел процесс');
        
        return { status: "ok" }
    }
}
