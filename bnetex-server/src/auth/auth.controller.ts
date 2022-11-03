import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ConfirmEmail } from '../users/dto/confirm-email.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ResendActivationLink } from './dto/resend-activation-link.dto';
import { GetActivationLinkTime } from './dto/get-activation-link-time.dto';
import { TokenVerify } from './dto/token-verify.dto';

// todo : add api description

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

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

}
