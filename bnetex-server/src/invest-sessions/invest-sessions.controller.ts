import { Controller, Get, Post } from '@nestjs/common';
import { InvestSessionsService } from './invest-sessions.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('invest-sessions')
@ApiTags('Invest sessions')
export class InvestSessionsController {

    constructor(
        private investSesssionsService : InvestSessionsService
    ) {}
    

    @Post()
    acceptBotCallback() {
        return this.investSesssionsService.acceptBotCallback();
    }

    @Get('total-invest-amount')
    getTotalInvestAmount() {
        return this.investSesssionsService.getTotalInvestAmount();
    }
}
