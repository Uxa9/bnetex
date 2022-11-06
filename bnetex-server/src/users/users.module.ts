import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvestSessionsModule } from '../invest-sessions/invest-sessions.module';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { UserRoles } from '../roles/user-roles.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Request } from '../request/request.model';
import { InvestSession } from '../invest-sessions/invest-sessions.model';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Request, InvestSession]),
        RolesModule,
        forwardRef(() => AuthModule),
        forwardRef(() => InvestSessionsModule)
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule { }
