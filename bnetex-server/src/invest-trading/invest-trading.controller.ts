import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {InvestSessionsService} from "../invest-sessions/invest-sessions.service";
import {InvestTradingService} from "./invest-trading.service";

@Controller('invest-trading')
export class InvestTradingController {

    constructor(
        private investTradingService : InvestTradingService
    ) {}

    @Get("balance/:id")
    getUserBalance(@Param("id") id: number) {
        return this.investTradingService.getUserBalance(id);
    }

    @Post("place-order")
    buyLimit(@Body() params: any) {
        return this.investTradingService.buyLimit(params);
    }
}
