import clsx from 'clsx';
import { DynamicImg } from 'lib/utils/DynamicImg';
import styles from './tradeCoinCard.module.scss';

export interface CoinMarketData {
    price: number;
    volume: number;
    change24h: number;
}

export interface TradeCoinCardProps {
    logo: string;
    ticker: string;
    market: CoinMarketData;
}

const TradeCoinCard = ({ logo, ticker, market }: TradeCoinCardProps) => {
    return (
        <div className={styles['card']}>
            <div className={styles['header']}>
                <div className={styles['header__coin-data']}>
                    <DynamicImg
                        path={logo}
                    />
                    <h6>{ ticker }</h6>
                </div>
                <div className={styles['header__change24h']}>

                </div>
            </div>
            <div className={styles['market-data']}>
                <div className={styles['market-data__numbers']}>
                    <h6>{ market.price }</h6>
                    <p
                        className={clsx(styles['volume'], 'text-bold')}
                    >
                        { market.volume }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TradeCoinCard;
