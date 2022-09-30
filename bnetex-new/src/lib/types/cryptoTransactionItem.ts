export interface CryptoTransactionItemType {
    date: Date,
    type: 'withdrawal' | 'income',
    wallet: string,
    coin: string,
    amount: number,
    destination: string,
    status: 'confirmed' | 'processing',
}
