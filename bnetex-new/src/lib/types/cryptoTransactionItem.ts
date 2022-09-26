export interface CryptoTransactionItemType {
    date: Date,
    type: 'Withdrawal' | 'Income',
    wallet: string,
    coin: string,
    amount: number,
    destination: string,
    status: 'Confirmed' | 'Processing',
}
