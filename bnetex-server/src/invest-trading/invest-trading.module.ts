import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { InvestTradingController } from './invest-trading.controller';
import { InvestTradingService } from './invest-trading.service';
import { BinanceSymbols } from './models/binanceSymbols.model';
import { PriceFilter } from './models/priceFilter.model';

@Module({
    imports: [
        UsersModule,
        SequelizeModule.forFeature([BinanceSymbols, PriceFilter]),
    ],
    controllers: [InvestTradingController],
    providers: [InvestTradingService],
    exports: [InvestTradingService]
})
export class InvestTradingModule { }
