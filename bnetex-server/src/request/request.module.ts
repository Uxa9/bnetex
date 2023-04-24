import { forwardRef, Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from './request.model';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RequestTypes } from './request-types.model';
import { WalletModule } from '../wallet/wallet.module';

@Module({
    providers: [RequestService],
    controllers: [RequestController],
    imports: [
        SequelizeModule.forFeature([Request, RequestTypes]),
        UsersModule,
        AuthModule,
        WalletModule
    ],
    exports: [
        RequestService
    ]
})
export class RequestModule { }
