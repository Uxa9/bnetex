import { Controller, Post } from '@nestjs/common';
import { InvestSessionsService } from './invest-sessions.service';

@Controller('invest-sessions')
export class InvestSessionsController {

    constructor(
        private investSesssionsService : InvestSessionsService
    ) {}
    

    @Post()
    acceptBotCallback() {
        return this.investSesssionsService.acceptBotCallback();
    }
}
