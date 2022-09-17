import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import genereateAndSendAuthCode from './genereateAndSendAuthCode';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);

        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);

        if (candidate) {
            throw new HttpException(
                'User with this e-mail alreadey exists',
                HttpStatus.BAD_REQUEST
            );
        }

        let authCode = await genereateAndSendAuthCode(userDto.email);

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password : hashPassword, activationLink : authCode });

        // return this.generateToken(user);

        return { status: 201 };
    }
    
    async confirmEmail(activationLink : string, email : string) {        
        const user = await this.userService.getUserByEmail(email);

        if ( activationLink === user.activationLink ) {
            
            return this.generateToken(user);
        } else {

            return { status: 400 };
        }
    }


    async generateToken(user : User) {
        const payload = { email : user.email, id : user.id, roles : user.roles }
        return {
            token : this.jwtService.sign(payload)
        }
    }


    private async validateUser(userDto : CreateUserDto) {
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
