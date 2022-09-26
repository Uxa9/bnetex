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
                private jwtService: JwtService) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto);

        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);

        if (candidate) {
            throw new HttpException(
                'User with this e-mail already exists',
                HttpStatus.BAD_REQUEST
            );
        }

        let authCode = await genereateAndSendAuthCode(userDto.email);

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        await this.userService.createUser({ ...userDto, password : hashPassword, activationLink : authCode });

        return { status: 201 };
    }
    
    async confirmEmail(confirmDto: ConfirmEmail) {        
        const user = await this.userService.getUserByEmail(confirmDto.email);

        if ( confirmDto.activationCode === user.activationLink ) {
            
            return this.generateToken(user);
        } else {
            
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }


    async generateToken(user : User) {
        const payload = { email : user.email, id : user.id, roles : user.roles }
        return {
            token : this.jwtService.sign(payload)
        }
    }


    private async validateUser(userDto : LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        if (!user) {
            throw new UnauthorizedException({
                message : "User with this e-mail not found"
            })
        }

        const passwordEq = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEq) {
            return user;
        }

        throw new UnauthorizedException({
            message : "Wrong password"
        });
    }
}
