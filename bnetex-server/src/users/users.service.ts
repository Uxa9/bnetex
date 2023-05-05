import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
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
import { PositionsService } from '../positions/positions.service';
import { UserRoles } from 'src/roles/user-roles.model';
import { JwtService } from '@nestjs/jwt';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { UserAlreadyExist } from 'src/exceptions/auth/userAlreadyExist.exception';
import { RoleNotFound } from 'src/exceptions/role/roleNotFound.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {

    constructor(@InjectModel(User) private usersRepository: typeof User,
        @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
        private roleService: RolesService,
        private jwtService: JwtService,
        @Inject(forwardRef(() => InvestSessionsService)) // чета хуита какая-то
        private investSessions: InvestSessionsService,
        @Inject(REQUEST) private readonly Request: Request,
        private positionService: PositionsService) { }

    async createUser(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByName('investor');
        if (!role) throw new RoleNotFound;

        const userExistCheck = await this.getUserByEmail(dto.email);
        if (userExistCheck) throw new UserAlreadyExist;
        
        try {
            const user = await this.usersRepository.create(dto);
    
            await this.userRolesRepository.create({
                userId: user.id,
                roleId: role.id
            });

            return {
                status: "SUCCESS",
                message: "USER_CREATED"
            };
        } catch (error) {            
            throw new InternalServerError;
        }
    }

    async getAllUsers() {
        try {
            const users = await this.usersRepository.findAll({ include: { all: true } });
            return users;
        } catch (error) {
            throw new InternalServerError;
        }
    }

    async getCurrentUser(){
        const req:any = this.Request;
        return await this.getUserById(req.user.id);
    }

    async changePassword(dto: ChangePasswordDto, user: User) {
        const passwordEq = await bcrypt.compare(dto.prevPassword, user.password);
        if (!passwordEq) throw new UserWrongPassword;
        const hashPassword = await bcrypt.hash(dto.newPassword, 5);

        try {
            await this.usersRepository.update(
                { password: hashPassword },
                { where: {id: user.id} }
            );
        } catch (error) {
            throw new InternalServerError;
        }

        return {
            status: "SUCCESS",
            message: "PASSWORD_CHANGED"
        }   
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.usersRepository.findOne({
                where: { email },
                include: { all: true }
            });
    
            return user;
        } catch (error) {  
            console.log(error)          
            throw new InternalServerError;
        }
    }

    async addRole(dto: AddRoleDto, userId: number) {
        const user = await this.usersRepository.findByPk(userId);
        const role = await this.roleService.getRoleByName(dto.value);

        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }

        throw new UserNotFoundException();
    }

    async confirmEmail(id: number) {
        const user = await this.usersRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        await user.update({ isActivated : true });
    }

    async getUserById(id: number) {
        try {
            const user = await this.usersRepository.findByPk(id, {                
                include: { all: true }
            });
            return user;
        } catch (error) {
            throw new InternalServerError;
        }
    }

    async getUser(id: number) {
        const user = await this.usersRepository.findByPk(id, {                
            include: { all: true }
        });

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

    async getWallets(user: User) {
        return {
            mainWallet: user.mainWallet,
            investWallet: user.investWallet
        }
    }

    verifyToken(token: string){
        return this.jwtService.verify(token) 
    }

    async transferMoney(dto: TransferMoney, user: User) {
        if (!this.usersRepository.getAttributes().hasOwnProperty(dto.reciever) ||
            !this.usersRepository.getAttributes().hasOwnProperty(dto.sender)) {
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

        await this.usersRepository.update(
            user,
            { where: { id: user.id } }
        );

        return {
            status: "SUCCESS",
            message: "TRANSFER_SUCCESS"
        }
    }

    private generatenumber(max: number, min: number) {
        return Math.random() * (max - min) + min;
    }

    async getPnL() {
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

    async getRoE() {
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

    async getUserPnlAndRoe(userId: number) {
        const sessions = await this.investSessions.getAllUserSessions(userId);

        if ( sessions.length == 0 ) {
            return {
                pnl: [],
                dates: [],
                roe: []
            }
        }

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
            pnl: pnl.map(it => Number(it.toFixed(2))),
            roe: roe.map(it => Number(it.toFixed(2))),
            dates
        }
    }

    async startInvest(dto: StartInvestDto, user: User) {
        return await this.investSessions.createSession(dto, user);
    }

    async stopInvest(user: User) {
        return this.investSessions.stopSession(user);
    }

    async getUserActiveSession(user: User) {
        const session = await this.investSessions.getUserActiveSession(user);

        if (!session) {
            return {
                startSessionTime : new Date().getTime(),
                pnl : 0,
                roe : 0,
                balance : 0,
            }
        }

        // Если позиция в профите, забираем 50%
        const sessionPnL = session.lastPnl > 0 ? session.lastPnl / 2 : session.lastPnl;
        const sessionRoE = session.lastRoe > 0 ? session.lastRoe / 2 : session.lastRoe;

        return {
            startSessionTime : session.startSessionTime,
            pnl : sessionPnL,
            roe : sessionRoE,
            balance : session.tradeBalance
        }
    }

    async getCurrentOpenPosition(user: User) {    
        const position = await this.positionService.getCurrentOpenPosition();

        if ( !position || !user.openTrade ) {
            return [];
        }
        
        const userSession = await this.investSessions.getUserActiveSession(user);

        if (userSession.startSessionTime.getTime() > position.enterTime) {
            return [];
        }

        const userShare = position.volumeUSDT / position.deposit * userSession.tradeBalance;
        const pnl = position.avegarePrice / position.enterPrice;

        return [{
            amount: userShare,
            entryPrice: position.enterPrice,
            markedPrice: position.avegarePrice,
            margin: {
                value: 1,
                type: 'cross'
            },
            PNL: userShare*(pnl - 1)
        }];
    }

    async setApiKey(dto: any, user: User) {
        const api = {
            api_key : dto.api_key,
            api_secret : dto.api_secret
        };

        try {
            await this.usersRepository.update(
                api,
                { where: { id: user.id } }
            );

            return {
                status: "SUCCESS",
                message: "API_CHANGED"
            }
        }
        catch {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "INTERNAL_SERVER_ERROR"
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
