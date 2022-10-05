import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import genereateAndSendAuthCode from '../services/genereateAndSendAuthCode';
import { UsersService } from '../users/users.service';
import { CreateRequest } from './dto/create-request.dto';
import { FulfillRequest } from './dto/fulfill-request.dto';
import { Request } from './request.model';

@Injectable()
export class RequestService {

    constructor(
        @InjectModel(Request) private requestRepository: typeof Request,
        private userService: UsersService
    ) {}

    async createRequest(dto: CreateRequest) {
        const user = await this.userService.getUserById(dto.userId);
        const authCode = await genereateAndSendAuthCode(user.email, "withdraw");
        
        const request = await this.requestRepository.create({
            ...dto,
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
}
