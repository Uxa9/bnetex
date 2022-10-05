import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from './request.model';
import { UsersModule } from '../users/users.module';

@Module({
    providers: [RequestService],
    controllers: [RequestController],
    imports: [
        SequelizeModule.forFeature([Request]),
        UsersModule
    ],
    exports: [
        RequestService
    ]
})
export class RequestModule { }
