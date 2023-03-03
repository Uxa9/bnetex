import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { Role } from "./roles/roles.model";
import { RolesModule } from './roles/roles.module';
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { RequestModule } from './request/request.module';
import { MailSenderModule } from './mailSender/mailer.module';
import { MongooseModule } from "@nestjs/mongoose";
import { PositionsModule } from './positions/positions.module';
import { InvestSessionsModule } from './invest-sessions/invest-sessions.module';
import { Request } from "./request/request.model";
import { InvestSession } from "./invest-sessions/invest-sessions.model";
import { InvestTradingModule } from './invest-trading/invest-trading.module';
import { Position } from "./positions/position.model";
import { PositionEnters } from "./positions/positionEnters.model";
import { GatewayModule } from "./gateway/gateway.module";
import { SocketModule } from "./socket/socket.module";
import { WalletModule } from './wallet/wallet.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath : `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            models: [User, Role, UserRoles, Request, InvestSession, Position, PositionEnters],
            autoLoadModels: true,
            logging: false
        }),
        MongooseModule.forRoot(`mongodb://127.0.0.1:27017/exchange`),
        UsersModule,
        RolesModule,
        AuthModule,
        TransactionModule,
        RequestModule,
        MailSenderModule,
        PositionsModule,
        InvestSessionsModule,
        InvestTradingModule,
        GatewayModule,
        SocketModule,
        WalletModule
    ]
})
export class AppModule{};