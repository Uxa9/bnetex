import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/req-user.decorator';
import { User } from 'src/users/users.model';
import { JwtGuard } from 'src/auth/jwt.guard';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
    constructor(private controllerService: WalletService) {}

    @UseGuards(JwtGuard)
    @Get('')
    getByValue(@ReqUser() user: User) {
        return this.controllerService.getUserWallet(user.id);
    }

    @Post('acceptTransmissions')
    acceptTransmissions(@Body() dto : any) {
        return this.controllerService.acceptIncomingTransmitions(dto);
    }
    
    @Get('transactions/:userId')
    @ApiBearerAuth()
    getUserTransactions(@Param('userId') userId : number) {
        return this.controllerService.getUserTransactions(userId);
    }

    @Post('withdraw')
    withdrawMoney(@Body() dto : any) {
        return this.controllerService.withdrawMoney(dto);
    }
}
