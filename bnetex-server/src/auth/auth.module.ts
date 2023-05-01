import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailSenderModule } from '../mailSender/mailer.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        forwardRef(() => UsersModule),
        MailSenderModule,
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "AMOGUS",
            signOptions: {
                expiresIn: '15m'
            }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [
        AuthService,
        JwtModule,
    ]
})
export class AuthModule { }
