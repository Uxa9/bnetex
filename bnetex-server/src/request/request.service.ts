import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import genereateAndSendAuthCode from '../services/genereateAndSendAuthCode';
import { UsersService } from '../users/users.service';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { CreateRequest } from './dto/create-request.dto';
import { FulfillRequest } from './dto/fulfill-request.dto';
import { RequestTypes } from './request-types.model';
import { Request } from './request.model';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RequestService {

    constructor(
        @InjectModel(Request) private requestRepository: typeof Request,
        @InjectModel(RequestTypes) private requestTypesRepository: typeof RequestTypes, 
        private userService: UsersService,
        private readonly mailerService: MailerService
    ) {}

    async createRequest(dto: CreateRequest) {        
        const user = await this.userService.getUserById(dto.userId);

        const lastUserRequest = await this.requestRepository.findAll({
            limit: 1,
            where: {
                userId: dto.userId
            },
            order: [ ['createdAt', 'DESC']]
        });

        if (lastUserRequest.length === 1) {
            const timeDiff = new Date().getTime() -
            new Date(lastUserRequest[0]?.createdAt?.toString()).getTime();
            
            if ( timeDiff < 30000 ) {
                throw new HttpException(
                    {
                        status: "ERROR",
                        message: "TOO_MANY_REQUESTS"
                    },
                    HttpStatus.FORBIDDEN
                )
            }
        }

        const type = await this.getRequestTypeIdByName(dto.type);

        const authCode = await genereateAndSendAuthCode(user.email, dto.type);
        
        const request = await this.requestRepository.create({
            ...dto,
            type: type,
            confirmCode: authCode 
        });

        return {
            status: "SUCCESS",
            message: "REQUEST_CREATED",
            requestId: request.id
        }
    }

    async fulfillRequest(dto: FulfillRequest) {
        const request = await this.requestRepository.findByPk(dto.requestId);

        if ( !request ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "REQUEST_NOT_EXIST"
                },
                HttpStatus.NOT_FOUND
            );
        }

        if ( request.fulfilled ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "REQUEST_ALREADY_FULFILLED"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        if ( request.confirmCode === dto.confirmCode ) {
            const user = await this.userService.getUserById(request.userId);

            if ( user.mainWallet < request.amount ) {
                throw new HttpException(
                    {
                        status: "ERROR",
                        message: "WALLET_AMOUNT_IS_LOWER_THAN_REQUESTED"
                    },
                    HttpStatus.BAD_REQUEST
                );
            }

            user.mainWallet -= request.amount;

            user.save();
            request.update({fulfilled: true});

            await this.mailerService.sendMail({
                to: 'kirill.yu99@gmail.com',
                from: 'infobnetex@internet.ru',
                subject: 'Вывод',
                template: 'withdraw',
                context: {
                    email: user.email,
                    amount: request.amount,
                    walletAddress: request.walletAddress
                }
            });
    

            return {
                status: "SUCCESS",
                message: "REQUEST_COMPLETE"
            }
        } else {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "CODE_IS_NOT_VALID"
                },
                HttpStatus.FORBIDDEN
            );
        }
    }

    async getAllUserRequest(userId: number) {
        const requests = await this.requestRepository.findAll({
            where: {userId: userId}
        });

        return requests;
    }

    async addRequestType(dto: CreateRequestTypeDto) {
        const requestType = await this.requestTypesRepository.create(dto);

        return requestType;
    }

    async getRequestTypeIdByName(type: string) {
        const requestType = await this.requestTypesRepository.findOne({
            where : { type }
        });

        if (!requestType) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "REQUEST_TYPE_WITH_THIS_NAME_NOT_FOUND"
                },
                HttpStatus.NOT_FOUND
            );
        }

        return requestType.id;
    }

    async getTransactionStatusNameById(id: number) {
        const requestType = await this.requestTypesRepository.findByPk(id);

        if (!requestType) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: 'REQUEST_TYPE_WITH_THIS_ID_NOT_FOUND'
                },
                HttpStatus.NOT_FOUND
            );
        }

        return requestType.type;
    }

    async getAllTransactionStatuses() {
        return await this.requestTypesRepository.findAll();
    }
}
