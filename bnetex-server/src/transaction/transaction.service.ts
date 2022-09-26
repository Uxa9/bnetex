import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.model';
import * as payment from './payment.js';

@Injectable()
export class TransactionService {

    constructor(@InjectModel(Transaction) private transactionRepository: typeof Transaction) {}

    async createTransaction(dto : CreateTransactionDto) {
        const transaction = await this.transactionRepository.create(dto);

        await payment.sync();

        let order = await payment.createOrder(1, 1);
        let status = await payment.getPayment(order.payment.payment_id);

        console.log(order);
        console.log(status);
        
        
        // transaction.$set('')
    }
}
