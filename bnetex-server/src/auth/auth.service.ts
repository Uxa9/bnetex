import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserNotFoundException } from '../exceptions/userNotFound.exception';
import generateAuthCode from '../services/generateAuthCode';
import { MailerService } from '@nestjs-modules/mailer';
import { ResendActivationLink } from './dto/resend-activation-link.dto';
import { GetActivationLinkTime } from './dto/get-activation-link-time.dto';
import { TokenVerify } from './dto/token-verify.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { UserAlreadyExist } from 'src/exceptions/auth/userAlreadyExist.exception';
import { UserNotActivated } from 'src/exceptions/user/userNotActivated.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';
import { UserFoundButNotActivated } from 'src/exceptions/auth/userNotActivated.exception';
import { RegUserDto } from './dto/user-registration.dto';
import { UserAlreadyActivated } from 'src/exceptions/user/userAlreadyActivated.exception';
import { MailNotSend } from 'src/exceptions/mailNotSend.exception';
import { AuthCodeResendTooEarly } from 'src/exceptions/auth/authCodeResendTooEarly.exception';
import { AuthCodeWrongException } from 'src/exceptions/auth/authCodeWrong.exception';

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
            ...token
        };
    }

    async registration(userDto: RegUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            if (candidate.isActivated === false) throw new UserFoundButNotActivated;

            throw new UserAlreadyExist;
        }

        let authCode = generateAuthCode();

        const hashPassword = await bcrypt.hash(userDto.password, 5);

        try {
            await this.mailerService.sendMail({
                to: userDto.email,
                from: process.env.SMTP_USER,
                subject: 'Код подтверждения',
                template: 'signup',
                context: {
                    code: authCode
                }
            });
        } catch (error) {
            throw new MailNotSend;   
        }        

        await this.userService.createUser({ 
            ...userDto, 
            password: hashPassword, 
            activationLink: authCode 
        });

        return {
            status: "SUCCESS",
            message: "REG_SUCCESS"
        }
    }

    async resendLink(dto: ResendActivationLink) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) throw new UserNotFoundException;
        if (user.isActivated) throw new UserAlreadyActivated;
        if (new Date().valueOf() - user.linkTimestamp.valueOf() < 30000) throw new AuthCodeResendTooEarly;

        let authCode = generateAuthCode();
        
        try {
            await this.mailerService.sendMail({
                to: dto.email,
                from: process.env.SMTP_USER,
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
        } catch (error) {
            throw new InternalServerError;
        }
    }

    async getActivationLinkDatetime(dto: GetActivationLinkTime) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) {
            throw new UserNotFoundException
        }

        return user.linkTimestamp;
    }

    async confirmEmail(confirmDto: ConfirmEmail) {
        const user = await this.userService.getUserByEmail(confirmDto.email);
        if (!user) throw new UserNotFoundException;
        if (user.isActivated) throw new UserAlreadyActivated;
        if (confirmDto.activationCode !== user.activationLink) throw new AuthCodeWrongException;

        const token = await this.generateToken(user);
        const authCode = generateAuthCode();
        
        try {
            user.update({
                isActivated: true,
                activationLink: authCode,
                linkTimestamp: new Date()
            });

            return {
                status: "SUCCESS",
                message: "EMAIL_CONFIRMED",
                ...token,
            };
        } catch (error) {
            throw new InternalServerError;
        }
    }

    async verifyToken(dto: TokenVerify) {
        try {
            await this.jwtService.verify(dto.token);
            return {
                valid: true
            }
        } catch (error) {
            return {
                valid: false
            }     
        }        
    }

    async dropPassword(dto: EmailDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) throw new UserNotFoundException;

        let authCode = generateAuthCode();
        
        try {    
            await user.update({
                activationLink: authCode,
                linkTimestamp: new Date()
            });    
        } catch (error) {
            throw new InternalServerError;            
        }

        try {
            await this.mailerService.sendMail({
                to: dto.email,
                from: 'infobnetex@internet.ru',
                subject: 'Сброс пароля',
                template: 'dropPassword',
                context: {
                    link: `https://bnetex.com/auth/password-recovery?code=${authCode}`
                }
            });
        } catch (error) {
            throw new MailNotSend;
        }

        return {
            status: "SUCCESS",
            message: "MAIL_SENT"
        }
    }

    async getNewPassword(dto: ResetPasswordDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) throw new UserNotFoundException;

        if (dto.code !== user.activationLink) throw new AuthCodeWrongException;

        const password = await bcrypt.hash(dto.password, 5);
        const authCode = generateAuthCode();

        try {
            await user.update({
                password: password,
                activationLink: authCode,
                linkTimestamp: new Date()
            });
            
            const token = await this.generateToken(user);
    
            return {
                status: "SUCCESS",
                message: "PASSWORD_CHANGED",
                ...token
            };
        } catch (error) {
            throw new InternalServerError;
        }
    }

    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            // id: user.id,
            roles: user.roles.map(role => {
                return {
                    name: role.name,
                    investPercent: role.investPercent,
                    desc: role.desc
                }
            }),
            mainWallet: user.mainWallet,
            investWallet: user.investWallet
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) throw new UserNotFoundException;

        if (!user.isActivated) throw new UserNotActivated;

        const passwordEq = await bcrypt.compare(userDto.password, user.password);

        if (!passwordEq) throw new UserWrongPassword;

        return user;
    }
}
