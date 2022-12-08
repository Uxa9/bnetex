import {Controller, Get, Post} from '@nestjs/common';
import {InvestSessionsService} from "../invest-sessions/invest-sessions.service";
import {InvestTradingService} from "./invest-trading.service";

@Controller('invest-trading')
export class InvestTradingController {

    constructor(
        private investTradingService : InvestTradingService
    ) {}

    @Get()
    getUserBalance() {
        return this.investTradingService.getUserBalance();
    }

    @Post()
    buyLimit() {
        return this.investTradingService.buyLimit();
    }
}
