import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.model';
import { Payment } from './payment.service';

@Injectable()
export class TransactionService {

    constructor(@InjectModel(Transaction) private transactionRepository: typeof Transaction) {}

    async createTransaction(dto : CreateTransactionDto) {
        const transaction = await this.transactionRepository.create(dto);

        const payment = new Payment();

        await payment.sync();

        let order = await payment.createOrder(transaction.id, dto.amount, 'USDTTRC20', 'test');      
        let status = await payment.getPayment(order.payment.payment_id);

        transaction.update({
            'statusId': 1,
            'paymentId': status.payment_id,
            'invoiceUrl': order.invoice.invoice_url,
            'payAddress': order.payment.pay_address
        })

        return transaction;
    }
}
