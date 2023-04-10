import { ArrowUpRight } from 'assets/images/icons';
import clsx from 'clsx';
import { DynamicImg } from 'lib/utils/DynamicImg';
import { SingleValueData } from 'lightweight-charts';
import Chart from 'modules/Global/components/lightChart/chart';
import styles from './tradeCoinCard.module.scss';

export interface CoinMarketData {
    price: number;
    volume: string;
    change24h: number;
    graphicData: SingleValueData[];
}

export interface TradeCoinCardProps {
    logo: string;
    ticker: string;
    market: CoinMarketData;
}

const TradeCoinCard = ({ logo, ticker, market: { change24h, price, volume, graphicData } }: TradeCoinCardProps) => {

    return (
        <div className={styles['card']}>
            <div className={styles['header']}>
                <div className={styles['header__coin-data']}>
                    <DynamicImg
                        path={logo}
                        className={styles['coin-logo']}
                    />
                    <h6>{ ticker.slice(0, 3) }</h6>
                </div>
                <div className={clsx(
                    styles['header__change24h'],
                    styles[`header__change24h--${change24h < 0 ? 'negative' : 'positive'}`]
                )}
                >
                    <ArrowUpRight
                        className={styles['change-arrow']}
                    />
                    <p className={'caption'}>
                        { `${change24h.toFixed(2)} %`  }
                    </p>
                </div>
            </div>
            <div className={styles['market-data']}>
                <div className={styles['market-data__numbers']}>
                    <h6>{ `$ ${price.toFixed(2)}` }</h6>
                    <p
                        className={clsx(styles['volume'], 'text-bold')}
                    >
                        { `$ ${volume}` }
                    </p>
                </div>
                <Chart
                    data={graphicData}
                    type={'PNL'}
                    header={false}
                    loading={false}
                    options={{
                        height: 50,
                        timeScale: {
                            visible: false,
                        },
                        rightPriceScale: {
                            visible: false,
                        },
                    }}
                    className={styles['chart']}
                />
            </div>
        </div>
    );
};

export default TradeCoinCard;
