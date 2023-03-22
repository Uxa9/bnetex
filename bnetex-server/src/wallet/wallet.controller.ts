import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

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
    getUserTransactions(@Param('userId') userId : number) {
        return this.controllerService.getUserTransactions(userId);
    }
}
