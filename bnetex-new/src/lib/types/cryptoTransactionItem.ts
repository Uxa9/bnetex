export interface CryptoTransactionItemType {
    date: Date,
    type: 'withdrawal' | 'income',
    wallet: string,
    coin: string,
    amount: number,
    destination: string,
    status: CryptoTransactionItemStatus,
}

export type CryptoTransactionItemStatus = 'confirmed' | 'processing' | 'unpayed';

export enum CryptoTransactionItemStatusMap {
    confirmed = 'Завершена',
    processing = 'В обработке',
    unpayed = 'Не оплачена',
}
