import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
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
    @Post()
    create(@Body() dto : CreateTransactionDto) {
        return this.transactionService.createTransaction(dto);
    }
    
}
