import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { UsersModule } from '../users/users.module';

@Module({
    providers: [TransactionService],
    controllers: [TransactionController],
    imports: [
        SequelizeModule.forFeature([Transaction]),
        UsersModule
    ],
    exports: [
        TransactionService,
    ]
})
export class TransactionModule { }
