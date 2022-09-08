import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';

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

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password : hashPassword });

        return this.generateToken(user);
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
            message : "Wrong or password"
        });
    }
}