export type TransactionType = 'withdraw' | 'income';
export type TransactionStatus = 'confirmed' | 'processing' | 'unpayed';

export interface Transaction {
    id: string;
    date: number;
    type: TransactionType;
    wallet: string;
    coin: string;
    amount: number;
    destination: string;
    status: TransactionStatus;
}

export type MiniTransaction = Pick<Transaction, 'date' | 'coin' | 'type' | 'amount'>

export enum TransactionStatusMap {
    confirmed = 'Завершена',
    processing = 'В обработке',
    unpayed = 'Не оплачена',
}

export enum TransactionTypeMap {
    withdraw = 'Отправлено',
    income = 'Получено',
}
