import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { InvestTradingController } from './invest-trading.controller';
import { InvestTradingService } from './invest-trading.service';
import { BinanceSymbols } from './models/binanceSymbols.model';
import { PriceFilter } from './models/priceFilter.model';
import { LotFilter } from './models/lotFIlter.model';

@Module({
    imports: [
        UsersModule,
        SequelizeModule.forFeature([BinanceSymbols, PriceFilter, LotFilter]),
    ],
    controllers: [InvestTradingController],
    providers: [InvestTradingService],
    exports: [InvestTradingService]
})
export class InvestTradingModule { }
