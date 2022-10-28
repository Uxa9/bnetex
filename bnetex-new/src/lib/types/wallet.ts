export type WalletCategoryType = 'mainWallet' | 'investWallet';

export enum WalletCategoryEnum {
    main = 'mainWallet',
    investor = 'investWallet',
}

export interface WalletCategoryWithBalance {
    mainWallet: number;
    investWallet: number;
}
