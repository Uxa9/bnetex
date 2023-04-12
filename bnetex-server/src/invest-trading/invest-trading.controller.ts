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
    placeOrder(@Body() params: any) {
        return this.investTradingService.placeOrder(params);
    }

    @Get("getLI/:id")
    getLeverageAndIsolated(@Param("id") id: number) {
        return this.investTradingService.getLeverageAndIsolated(id);
    }

    @Get("getMaxLeverage/:id")
    getMaxLeverage(@Param("id") id: number) {
        return this.investTradingService.getMaxLeverage(id);
    }

    @Post('setUserLeverage')
    setUserLeverage(@Body() params: any) {
        return this.investTradingService.setUserLeverage(params);
    }

    @Get("userPositions/:id")
    getUserPositions(@Param("id") id: number) {
        return this.investTradingService.getUserPositions(id);
    }

    @Get("closeAllPositions/:id")
    closeAllPositions(@Param("id") id: number) {
        return this.investTradingService.closeAllPositions(id);
    }

    @Post("getBinanceSymbols")
    getBinanceSymbols(@Body() params: any) {
        return this.investTradingService.getBinanceSymbols(params);
    }

    @Get("test")
    test() {
        // return this.investTradingService.getBinanceSymbol();
        // return this.investTradingService.test();
    }
}
