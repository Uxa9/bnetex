import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserNotFoundException } from '../exceptions/userNotFound.exception';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { StartInvestDto } from './dto/start-invest.dto';
import { Op } from 'sequelize';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InvestSessionsService } from '../invest-sessions/invest-sessions.service';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
        @Inject(forwardRef(() => InvestSessionsService)) // чета хуита какая-то
        private investSessions: InvestSessionsService) { }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('investor');

        user.$set('roles', [role.id])
            .then(() => {
                user.roles = [role];
            });

        return {
            status: "SUCCESS",
            message: "USER_CREATED"
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
    }

    async changePassword(dto: ChangePasswordDto) {

        const user = await this.getUserById(dto.userId);

        const passwordEq = await bcrypt.compare(dto.prevPassword, user.password);

        if ( passwordEq ) {
            const hashPassword = await bcrypt.hash(dto.newPassword, 5);

            await user.update({
                password: hashPassword
            });

            return {
                status: "SUCCESS",
                message: "PASSWORD_CHANGED"
            }
        } else {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "PREVIOUS_PASSWORD_WRONG"
                },
                HttpStatus.BAD_REQUEST
            );
        }

    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true }
        });

        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }

        throw new UserNotFoundException();
    }

    async confirmEmail(id: number) {
        const user = await this.userRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        await user.update({ isActivated : true });
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async getUser(id: number) {
        const user = await this.userRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        return {
            email: user.email,
            mainWallet: user.mainWallet,
            investWallet: user.investWallet,
            openTrade: user.openTrade,
            tradeBalance: user.tradeBalance
        };
    }

    async getWallets(id: number) {
        const user = await this.getUserById(id);

        return {
            mainWallet: user.mainWallet,
            investWallet: user.investWallet
        }
    }

    async transferMoney(dto: TransferMoney) {
        const user = await this.userRepository.findByPk(dto.userId);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        if (!this.userRepository.getAttributes().hasOwnProperty(dto.reciever) ||
            !this.userRepository.getAttributes().hasOwnProperty(dto.sender)) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "ENTRED_WALLET_IS_NOT_EXIST"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        if ( user[dto.sender] < dto.amount ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "WALLET_AMOUNT_IS_LOWER_THAN_REQUESTED"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        user[dto.sender] -= dto.amount;
        user[dto.reciever] += dto.amount;

        await user.save();

        return {
            status: "SUCCESS",
            message: "TRANSFER_SUCCESS"
        }
    }

    private generatenumber(max: number, min: number) {
        return Math.random() * (max - min) + min;
    }

    async getPnL(id: number) {
        await this.getUserById(id);

        return {
            pnl: {
                values: [
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                ],
                dates: [
                    '10.02',
                    '17.02',
                    '24.02',
                    '31.02',
                    '07.03',
                    '14.03',
                    '21.04'
                ]
            }
        }
    }

    async getRoE(id: number) {
        await this.getUserById(id);

        return {
            roe: {
                values: [
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                ],
                dates: [
                    '10.02',
                    '17.02',
                    '24.02',
                    '31.02',
                    '07.03',
                    '14.03',
                    '21.04'
                ]
            }
        }
    }

    async getUserPnlAndRoe(id: number) {
        const sessions = await this.investSessions.getAllUserSessions(id);

        let pnl = [];
        let roe = [];
        let dates = [];

        pnl.push(sessions[0].lastPnl);
        roe.push(sessions[0].lastRoe);
        dates.push(new Date(new Date(sessions[0].stopSessionTime).getTime()).toLocaleString());

        for (let i = 1; i < sessions.length - 1; i++) {
            pnl.push(0);
            roe.push(0);
            dates.push(new Date(new Date(sessions[i].stopSessionTime).getTime() - 1).toLocaleString());
            pnl.push(sessions[i].lastPnl);
            roe.push(sessions[i].lastRoe);
            dates.push(new Date(new Date(sessions[i].stopSessionTime).getTime()).toLocaleString());
        }

        if ( sessions[sessions.length - 1].stopSessionTime === null ) {
            pnl.push(sessions[sessions.length - 1].lastPnl || 0);
            roe.push(sessions[sessions.length - 1].lastRoe || 0);
            dates.push(new Date().toLocaleString());
        }
        
        
        return {
            pnl,
            roe,
            dates
        }
    }

    async startInvest(dto: StartInvestDto) {
        return await this.investSessions.createSession(dto);
    }

    async stopInvest(id: number) {
        const res = await this.investSessions.stopSession(id);
        
        return res; //опять чето странное
    }

    async getUserActiveSession(id: number) {
        const session = await this.investSessions.getUserActiveSession(id);

        if ( !session ) {
            return {
                startSessionTime : new Date().getTime() ,
                pnl : 0,
                roe : 0,
                balance : 0
            }
        }

        return {
            startSessionTime : session.startSessionTime ,
            pnl : session.lastPnl,
            roe : session.lastRoe,
            balance : session.tradeBalance
        }
    }

    async getTotalInvestAmount() {
        const res = await this.userRepository.findAll({
            where: {
                tradeBalance: {
                    [Op.gt]: 0
                }
            },
            attributes: ['tradeBalance']
        });

        return res.reduce((acc, user) => acc + user.tradeBalance, 0);
    }
}
