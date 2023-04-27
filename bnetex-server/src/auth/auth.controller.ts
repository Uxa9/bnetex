import { Body, Controller, Get, HttpCode, Param, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { AuthService } from './auth.service';
import { ResendActivationLink } from './dto/resend-activation-link.dto';
import { GetActivationLinkTime } from './dto/get-activation-link-time.dto';
import { TokenVerify } from './dto/token-verify.dto';
import {EmailDto} from "./dto/email.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import { LoginResponseSuccess } from './reponseTypes/loginResponseType';
import { RegSuccess } from './reponseTypes/regResponseType';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UserNotFoundException } from 'src/exceptions/user/userNotFound.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';
import { UserNotActivated } from 'src/exceptions/user/userNotActivated.exception';
import { UserAlreadyExist } from 'src/exceptions/auth/userAlreadyExist.exception';
import { RegUserDto } from './dto/user-registration.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserFoundButNotActivated } from 'src/exceptions/auth/userNotActivated.exception';
import { RoleNotFound } from 'src/exceptions/role/roleNotFound.exception';
import { UserAlreadyActivated } from 'src/exceptions/user/userAlreadyActivated.exception';
import { MailNotSend } from 'src/exceptions/mailNotSend.exception';
import { AuthCodeResendTooEarly } from 'src/exceptions/auth/authCodeResendTooEarly.exception';
import { MailSentResponse } from './reponseTypes/mailSentResponseType';
import { ActivationLinkSuccess } from './reponseTypes/activationLinkResponseType';
import { ConfirmEmailSuccess } from './reponseTypes/confirmEmailResponseType';
import { AuthCodeWrongException } from 'src/exceptions/auth/authCodeWrong.exception';
import { TokenConfirmResponse } from './reponseTypes/tokenConfirmResponseType';
import { PasswordChangedSuccess } from './reponseTypes/passwordChanged.exception';

// todo : add api description

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary : 'Login user'
    })
    @ApiResponse({
        status : 200,
        type : LoginResponseSuccess
    })
    @ApiException(() => [
        UserNotFoundException, 
        UserWrongPassword,
        UserNotActivated,
        InternalServerError
    ])
    @Post('login')
    login(@Body() userDto: LoginUserDto) {
        
        return this.authService.login(userDto);
    }

    @ApiOperation({
        summary : 'User registration'
    })
    @ApiResponse({
        status : 201,
        type : RegSuccess
    })
    @HttpCode(201)
    @ApiException(() => [
        UserFoundButNotActivated,
        UserAlreadyExist,
        RoleNotFound,
        MailNotSend,
        InternalServerError
    ])
    @Put('registration')
    registration(@Body() userDto: RegUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({
        summary : 'Update activation code and resend it to user'
    })
    @ApiResponse({
        status : 200,
        type : MailSentResponse
    })
    @ApiException(() => [
        UserAlreadyActivated,
        UserNotFoundException,
        AuthCodeResendTooEarly,
        InternalServerError
    ])
    @Post('resend-activation-link')
    resendActivationLink(@Body() dto: ResendActivationLink) {
        return this.authService.resendLink(dto);
    }

    @ApiOperation({
        summary : 'Get user last activation link updated'
    })
    @ApiResponse({
        status : 200,
        type : ActivationLinkSuccess
    })
    @ApiException(() => [
        UserNotFoundException,
        InternalServerError
    ])
    @Post('activation-link-datetime')
    getActivationLinkDatetime(@Body() dto: GetActivationLinkTime) {
        return this.authService.getActivationLinkDatetime(dto);
    }

    @ApiOperation({
        summary : 'Confirm user email'
    })
    @ApiResponse({
        status : 200,
        type : ConfirmEmailSuccess
    })
    @ApiException(() => [
        UserNotFoundException,
        AuthCodeWrongException,
        UserAlreadyActivated,
        InternalServerError
    ])
    @Post('confirm-email')
    confirmEmail(@Body() confirmDto: ConfirmEmail) {
        return this.authService.confirmEmail(confirmDto);
    }

    @ApiOperation({
        summary : 'Verifiy jwt'
    })
    @ApiResponse({
        status : 200,
        type : TokenConfirmResponse
    })
    @ApiException(() => [
        InternalServerError
    ])
    @Post('token/verify')
    verifyToken(@Body() dto: TokenVerify) {
        return this.authService.verifyToken(dto);
    }

    @ApiOperation({
        summary : 'Drop user password'
    })
    @ApiResponse({
        status : 200,
        type : MailSentResponse
    })
    @ApiException(() => [
        UserNotFoundException,
        MailNotSend,
        InternalServerError
    ])
    @Post('drop-password')
    dropPassword(@Body() dto: EmailDto) {
        return this.authService.dropPassword(dto);
    }

    @ApiOperation({
        summary : 'Reset user password'
    })
    @ApiResponse({
        status : 200,
        type : PasswordChangedSuccess
    })
    @ApiException(() => [
        UserNotFoundException,
        AuthCodeWrongException,
        InternalServerError
    ])
    @Post('get-new-password')
    getNewPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.getNewPassword(dto);
    }

}
