import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailSenderModule } from '../mailSender/mailer.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "AMOGUS",
            signOptions: {
                expiresIn: '24h'
            }
        }),
        MailSenderModule
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule { }
