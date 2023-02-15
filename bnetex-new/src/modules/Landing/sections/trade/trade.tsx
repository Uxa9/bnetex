import { Button } from 'lib/ui-kit';
import TradeCoinCard, { TradeCoinCardProps } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';
import { useEffect, useState } from 'react';
import { tradeSectionCoins } from './coins';
import getTickerPriceStatistics from './getMarketData';
import styles from './trade.module.scss';

const Trade = () => {

    const [coins, setCoins] = useState<TradeCoinCardProps[]>([]);

    useEffect(() => {
        const tickers = tradeSectionCoins.map(it => it.ticker);
        getTickerPriceStatistics(tickers)
            .then((marketData) => {
                const coinsWithMarketData: TradeCoinCardProps[] =
                    tradeSectionCoins.map((it, index) => {
                        return { market: marketData[index], ...it };
                    });
                setCoins(coinsWithMarketData);
            });
    }, []);

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['cards']}>
                    {
                        coins.map(it =>
                            <TradeCoinCard
                                key={it.ticker}
                                {...it}
                            />
                        )
                    }
                </div>
                <div className={styles['info']}>
                    <h2>Торгуйте вместе с <span>алгоритмом</span></h2>
                    <p className={'text'}>
                        Вам необязательно передавать капитал в управление алгоритму.
                        Вы также можете торговать и вручную, а мы будем подсказывать,
                        когда следует продать актив, а когда лучше купить.
                    </p>
                    <Button
                        buttonStyle={'primary'}
                        text={'Открыть терминал'}
                        onClick={() => {
                            //toDo: переход в торговый терминал
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Trade;
