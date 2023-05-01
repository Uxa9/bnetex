import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
    constructor(private controllerService: WalletService) {}

    @Get('/:userId')
    getByValue(@Param('userId') userId : number) {
        return this.controllerService.getUserWallet(userId);
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
