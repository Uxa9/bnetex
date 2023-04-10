import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InvestTradingController } from './invest-trading.controller';
import { InvestTradingService } from './invest-trading.service';

@Module({
    imports: [UsersModule],
    controllers: [InvestTradingController],
    providers: [InvestTradingService],
    exports: [InvestTradingService]
})
export class InvestTradingModule { }
