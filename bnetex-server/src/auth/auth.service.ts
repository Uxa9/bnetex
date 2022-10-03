import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import genereateAndSendAuthCode from './genereateAndSendAuthCode';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService) { }

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto);

        const token = await this.generateToken(user);
            
        return {
            status: "SUCCESS",
            message: "EMAIL_CONFIRMED",
            userId: user.id,
            ...token
        };
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);

        if (candidate) {
            throw new HttpException({
                status: "ERROR",
                message: "USER_WITH_THIS_EMAIL_ALREADY_EXISTS"
            },
                HttpStatus.BAD_REQUEST
            );
        }

        let authCode = await this.callGenerateActivationLink(userDto.email);

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        await this.userService.createUser({ ...userDto, password: hashPassword, activationLink: authCode });

        return {
            status: "SUCCESS",
            message: "REG_SUCCESS"
        }
    }

    async confirmEmail(confirmDto: ConfirmEmail) {
        const user = await this.userService.getUserByEmail(confirmDto.email);

        if (confirmDto.activationCode === user.activationLink) {

            const token = await this.generateToken(user);

            user.update({
                isActivated : true
            });

            return {
                status: "SUCCESS",
                message: "EMAIL_CONFIRMED",
                ...token
            };
        } else {

            throw new HttpException({
                status: "ERROR",
                message: "WRONG_CODE"
            },
                HttpStatus.FORBIDDEN
            );
        }
    }

    async callGenerateActivationLink(email: string) {
        return await genereateAndSendAuthCode(email);
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        if (!user) {

            throw new UnauthorizedException({
                status: "ERROR",
                message: "USER_NOT_FOUND"
            });
        }

        if (!user.isActivated) {

            throw new UnauthorizedException({
                status: "ERROR",
                message: "USER_NOT_ACTIVATED"
            });
        }

        const passwordEq = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEq) {
            return user;
        }

        throw new UnauthorizedException({
            status: "ERROR",
            message: "WRONG_PASSWORD"
        });
    }
}
