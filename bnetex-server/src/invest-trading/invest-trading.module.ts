import { Module } from '@nestjs/common';
import { InvestTradingController } from './invest-trading.controller';
import { InvestTradingService } from './invest-trading.service';

@Module({
  controllers: [InvestTradingController],
  providers: [InvestTradingService]
})
export class InvestTradingModule {}
