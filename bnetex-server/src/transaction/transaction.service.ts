import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.model';
import { Payment } from './payment.service';
import { UsersService } from '../users/users.service';
import { TransactionStatus } from './transaction-status.model';
import { CreateTransactionStatusDto } from './dto/create-transaction-status.dto';

@Injectable()
export class TransactionService {

    constructor(
        @InjectModel(Transaction) private transactionRepository: typeof Transaction,
        @InjectModel(TransactionStatus) private transactionStatusRepository: typeof TransactionStatus,
        private userService: UsersService) {}

    async createTransaction(dto: CreateTransactionDto) {
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
        });

        return transaction; // или шо надо возвращать то
    }

    async updateTransactionStatus(id: number, status: number) {
        const transaction = await this.transactionRepository.findByPk(id);

        if ( transaction ) {
            transaction.update({
                'statusId' : status
            });
        } else {
            throw new HttpException(
                'Transaction not found',
                HttpStatus.NOT_FOUND
            );
        }

        return transaction;
    }

    async fulfillTransaction(id: number) {
        const transaction = await this.transactionRepository.findByPk(id);

        if ( transaction ) {
            transaction.update({
                'statusId' : 3
            });

            const user = await this.userService.getUserById(transaction.userId);

            user.update({
                'mainWallet' : user.mainWallet + transaction.amount
            });
        } else {
            throw new HttpException(
                'Transaction not found',
                HttpStatus.NOT_FOUND
            );
        }

        return transaction;
    }

    async addTransactionStatus(dto: CreateTransactionStatusDto) {
        const transactionStatus = await this.transactionStatusRepository.create(dto);

        return transactionStatus;
    }

    async getTransactionStatusIdByName(name: string) {
        const transactionStatus = await this.transactionStatusRepository.findOne({
            where : { name }
        });

        if (!transactionStatus) {
            throw new HttpException(
                'Transaction status name not found',
                HttpStatus.NOT_FOUND
            );
        }

        return transactionStatus.id;
    }

    async getTransactionStatusNameById(id: number) {
        const transactionStatus = await this.transactionStatusRepository.findByPk(id);

        if (!transactionStatus) {
            throw new HttpException(
                'Transaction status id not found',
                HttpStatus.NOT_FOUND
            );
        }

        return transactionStatus.name;
    }

    async getAllTransactionStatuses() {
        return await this.transactionStatusRepository.findAll();
    }
}
