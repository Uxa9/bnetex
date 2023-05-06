import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InvestSessionsService } from './invest-sessions.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ReqUser } from 'src/auth/req-user.decorator';
import { User } from 'src/users/users.model';

@Controller('invest-sessions')
@ApiTags('Invest sessions')
export class InvestSessionsController {
    constructor(private investSesssionsService : InvestSessionsService) {}
    

    @Post()
    acceptBotCallback() {
        return this.investSesssionsService.acceptBotCallback();
    }

    @Get('total-invest-amount')
    getTotalInvestAmount() {
        return this.investSesssionsService.getTotalInvestAmount();
    }

    @Get('history')
    @ApiOperation({ summary : 'Get history about last sessions' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getHistory(@ReqUser() user: User) {
        return this.investSesssionsService.getHistory(user);
    }
}
