import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ResendActivationLink } from './dto/resend-activation-link.dto';
import { GetActivationLinkTime } from './dto/get-activation-link-time.dto';
import { TokenVerify } from './dto/token-verify.dto';
import {EmailDto} from "./dto/email.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import { LoginResponseSuccess } from './reponseTypes/loginResponseTypes';
import { ResponseFailure } from './reponseTypes/failureGenericType';
import { RegSuccess } from './reponseTypes/regResponseTypes';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UserNotFoundException } from 'src/exceptions/user/userNotFound.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';
import { UserNotActivated } from 'src/exceptions/user/userNotActivated.exception';
import { UserAlreadyExist } from 'src/exceptions/auth/userAlreadyExist.exception';

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
        status : 200,
        type : RegSuccess
    })
    @ApiException(() => [
        UserAlreadyExist,
        UserNotActivated
    ])
    @Post('registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @Post('resend-activation-link')
    resendActivationLink(@Body() dto: ResendActivationLink) {
        return this.authService.resendLink(dto);
    }

    @Post('activattion-link-datetime')
    getActivationLinkDatetime(@Body() dto: GetActivationLinkTime) {
        return this.authService.getActivationLinkDatetime(dto);
    }

    @Post('confirm-email')
    confirmEmail(@Body() confirmDto: ConfirmEmail) {
        return this.authService.confirmEmail(confirmDto);
    }

    @Post('token/verify/')
    verifyToken(@Body() dto: TokenVerify) {
        return this.authService.verifyToken(dto);
    }

    @Post('drop-password')
    dropPassword(@Body() dto: EmailDto) {
        return this.authService.dropPassword(dto);
    }

    @Post('get-new-password')
    getNewPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.getNewPassword(dto);
    }

}
