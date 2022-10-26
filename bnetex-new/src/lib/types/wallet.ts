export type WalletCategoryType = 'main' | 'investor';

export enum WalletCategoryEnum {
    main = 'main',
    investor = 'investor',
}

export interface WalletCategoryWithBalance {
    main: number;
    investor: number;
}
