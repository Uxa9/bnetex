import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import genereateAndSendAuthCode from '../services/genereateAndSendAuthCode';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserNotFoundException } from '../exceptions/userNotFound.exception';
import generateAuthCode from '../services/generateAuthCode';
import { MailerService } from '@nestjs-modules/mailer';
import { ResendActivationLink } from './dto/resend-activation-link.dto';
import { GetActivationLinkTime } from './dto/get-activation-link-time.dto';
import { TokenVerify } from './dto/token-verify.dto';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService,
        private readonly mailerService: MailerService) { }

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

        let authCode = generateAuthCode();

        await this.mailerService.sendMail({
            to: userDto.email,
            from: 'infobnetex@internet.ru',
            subject: 'Код подтверждения',
            template: 'signup',
            context: {
                code: authCode
            }
        });

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        await this.userService.createUser({ ...userDto, password: hashPassword, activationLink: authCode });

        return {
            status: "SUCCESS",
            message: "REG_SUCCESS"
        }
    }

    async resendLink(dto: ResendActivationLink) {
        const user = await this.userService.getUserByEmail(dto.email);

        if (!user) {
            throw new HttpException({
                status: "ERROR",
                message: "USER_NOT_FOUND"
            },
                HttpStatus.NOT_FOUND
            );
        }

        let authCode = generateAuthCode();

        await this.mailerService.sendMail({
            to: dto.email,
            from: 'infobnetex@internet.ru',
            subject: 'Код подтверждения',
            template: 'signup',
            context: {
                code: authCode
            }
        });

        await user.update({
            activationLink: authCode,
            linkTimestamp: new Date()
        });

        return {
            status: "SUCCESS",
            message: "MAIL_SENT"
        }
    }

    async getActivationLinkDatetime(dto: GetActivationLinkTime) {
        const user = await this.userService.getUserByEmail(dto.email);

        if (!user) {
            throw new HttpException({
                status: "ERROR",
                message: "USER_NOT_FOUND"
            },
                HttpStatus.NOT_FOUND
            );
        }

        return user.linkTimestamp;
    }

    async confirmEmail(confirmDto: ConfirmEmail) {
        const user = await this.userService.getUserByEmail(confirmDto.email);

        if (!user) {
            throw new UserNotFoundException();
        }

        if (user.isActivated) {
            return {
                status: "ERROR",
                message: "EMAIL_ALREADY_CONFIRMED"
            }
        }

        if (confirmDto.activationCode === user.activationLink) {

            const token = await this.generateToken(user);

            let authCode = generateAuthCode();

            user.update({
                isActivated: true,
                activationLink: authCode
            });

            return {
                status: "SUCCESS",
                message: "EMAIL_CONFIRMED",
                ...token,
                userId: user.id,
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

    // async callGenerateActivationLink() {
    //     return genereateAuthCode();
    // }

    async verifyToken(dto: TokenVerify) {

        try {
            const valid = await this.jwtService.verify(dto.token);
              
            if (valid) {
                return {
                    valid: true
                }
            } else {
                return {
                    valid: false
                }
            }
        } catch (error) {
            return {
                valid: false
            }            
        }
        
    }

    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            roles: user.roles,
            mainWallet: user.mainWallet,
            investWallet: user.investWallet
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        if (!user) {
            throw new UserNotFoundException();
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

    async dropPassword(dto: EmailDto) {
        const user = await this.userService.getUserByEmail(dto.email);

        if (!user) {
            throw new UserNotFoundException();
        }

        let authCode = generateAuthCode();

        user.update({
            activationLink: authCode
        });

        await this.mailerService.sendMail({
            to: dto.email,
            from: 'infobnetex@internet.ru',
            subject: 'Сброс пароля',
            template: 'dropPassword',
            context: {
                code: authCode
            }
        });

        return {
            status: "SUCCESS",
            message: "MAIL_SENT"
        }
    }

    async getNewPassword(dto: ConfirmEmail) {
        const user = await this.userService.getUserByEmail(dto.email);

        if (!user) {
            throw new UserNotFoundException();
        }

        const password = generateAuthCode(12);

        await user.update({
            password: bcrypt.hashSync(password, 5)
        });

        await this.mailerService.sendMail({
            to: dto.email,
            from: 'infobnetex@internet.ru',
            subject: 'Новый пароль',
            template: 'newPassword',
            context: {
                password: password
            }
        });

        return {
            status: "SUCCESS",
            message: "MAIL_SENT"
        }
    }
}
