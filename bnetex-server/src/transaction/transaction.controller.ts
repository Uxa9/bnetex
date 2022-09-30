import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionStatusDto } from './dto/create-transaction-status.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './transaction-status.model';
import { Transaction } from './transaction.model';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @ApiOperation({
        summary : 'Create transaction'
    })
    @ApiResponse({
        status : 200,
        type : Transaction
    })
    @Post('/create')
    create(@Body() dto : CreateTransactionDto) {
        return this.transactionService.createTransaction(dto);
    }

    @ApiOperation({
        summary : 'Get transaction by id'
    })
    @ApiResponse({
        status : 200,
        type : Transaction
    })
    @Get('/:id')
    getTransaction(@Param('id') id: number) {
        return this.transactionService.getTransaction(id);
    }

    @ApiOperation({
        summary : 'Get user transactions by id'
    })
    @ApiResponse({
        status : 200,
        type : Transaction
    })
    @Get('/user/:id')
    getUserTransactions(@Param('id') id: number) {
        return this.transactionService.getUserTransactions(id);
    }

    @ApiOperation({
        summary : 'Fulfill transaction'
    })
    @ApiResponse({
        status : 200,
        type : Transaction
    })
    @Post('/:id/fulfill')
    fulfillTransaction(@Body() req: any) {
        return this.transactionService.fulfillTransaction(req);
    }

    @ApiOperation({
        summary : 'Create transaction status'
    })
    @ApiResponse({
        status : 200,
        type : TransactionStatus
    })
    @Put('/status')
    addStatus(@Body() dto : CreateTransactionStatusDto) {
        return this.transactionService.addTransactionStatus(dto);
    }

    @ApiOperation({
        summary : 'Show transaction status by id'
    })
    @ApiResponse({
        status : 200,
        type : TransactionStatus
    })
    @Get('/status/:id')
    getStatus(@Param('id') id: number) {
        return this.transactionService.getTransactionStatusNameById(id);
    }

    @ApiOperation({
        summary : 'Show all transaction statuses'
    })
    @ApiResponse({
        status : 200,
        type : TransactionStatus
    })
    @Get('/status')
    getAllStatuses() {
        return this.transactionService.getAllTransactionStatuses();
    }
}
