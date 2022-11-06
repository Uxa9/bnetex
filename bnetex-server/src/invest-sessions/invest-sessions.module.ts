import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.model';
import { InvestSessionsController } from './invest-sessions.controller';
import { InvestSessionsService } from './invest-sessions.service';
import { InvestSession } from './invest-sessions.model';

@Module({
    controllers: [InvestSessionsController],
    providers: [InvestSessionsService],
    imports: [
        forwardRef(() => UsersModule),
        SequelizeModule.forFeature([User, InvestSession]),
    ],
    exports: [
        InvestSessionsService
    ]
})
export class InvestSessionsModule { }
