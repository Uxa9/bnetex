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


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath : `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles],
            autoLoadModels: true
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        TransactionModule,
        RequestModule,
        MailSenderModule
    ]
})
export class AppModule{};