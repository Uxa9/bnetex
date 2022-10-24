export interface CryptoTransactionItemType {
    date: Date,
    type: 'withdraw' | 'income',
    wallet: string,
    coin: string,
    amount: number,
    destination: string,
    status: 'confirmed' | 'processing',
}
