import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import AreaChart from './chart/areaChart';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import classNames from 'classnames';
import { getHistoricalData } from 'services/getHistoricalData';

type InvestorViewType = 'trade' | 'history';

interface InvestProfitInterface {
    dates: string[],
    pnlValues: number[],
    roeValues: number[]
}

const InvestorView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');
    const [graphicData, setGraphicData] = useState<InvestProfitInterface>({
        dates: [],
        pnlValues: [],
        roeValues: []
    });
    const [investProfit, setInvestProfit] = useState(0);
    const [investPercentProfit, setInvestPercentProfit] = useState(0);

    const getData = async (period: number, amount: number) => {
        const res = await getHistoricalData(period, amount);

        setGraphicData({
            dates: res.dates,
            pnlValues: res.pnlValues.map((item: any) => Number(Number(item).toFixed(2))),
            roeValues: res.roeValues.map((item: any) => Number(Number(item).toFixed(2)))
        });      
        
        setInvestPercentProfit(res.roeValues[res.roeValues.length - 1]);
        setInvestProfit(investPercentProfit * amount / 100);

        return;
    }

    return (
        <>
            <div className='terminal-side-block'>
                <div
                    className={classNames(styles['investor-view-card'], 'card')}
                >
                    <div className={styles['investor-view-wrapper__header']}>
                        <ToggleButtonGroup
                            title={''}
                            name={'investor_terminal'}
                            onChange={(value: InvestorViewType) => {
                                setViewType(value);
                            }}
                            value={viewType}
                        >
                            <ToggleButton
                                text={'Торговля'}
                                value={'trade'}
                            />
                            <ToggleButton
                                text={'История'}
                                value={'history'}
                            />
                        </ToggleButtonGroup>

                        <ToolTip
                            title='Что такое история?'
                            infoText='История или история сделок - это исторические записи фактических транзакций по позициям. 
                        В раздел попадают только исполненные ордера.'
                        />
                    </div>
                    {
                        viewType === 'trade' ?
                            <TradeView /> :
                            <HistoryView 
                                handleClick={getData}
                            />
                    }
                </div>
                {
                    viewType === 'trade' ? 
                        <TradeView /> :
                        <HistoryView handleClick={getData} />
                }
            </div>
            <div
                className={classNames(
                    styles['investor-view-card'],
                    styles['data-card'],
                    'card'
                )}
            >
                <ToolTip 
                    title='Доход инвестора'
                    infoText=''
                />
                <div
                    className={styles['data-card__row']}
                >
                    <p
                        className={styles['header']}
                    >
                        Доход инвестора
                    </p>
                    <div
                        className={styles['investor-income']}
                    >
                        <span
                            className={styles['investor-income-amount']}
                        >
                            {Number(Number(investProfit).toFixed(2))}
                        </span>
                        <span
                            className={styles['investor-income-percent']}
                        >
                            {Number(Number(investPercentProfit).toFixed(2))}
                        </span>
                    </div>
                </div>
                <div className={classNames(styles['investor-view-card'], 'card')}>
                    <AreaChart
                        dates={graphicData.dates}
                        values={graphicData.pnlValues}
                        title={
                            <ToolTip
                                title={'PnL'}
                                infoText={'PNL (Profit and Loss) – это величина, которая показывает разницу между прибылью и убытками в трейдинге.'}
                            />
                        }
                    />
                </div>
            </div>
            <div className={classNames(
                styles['investor-view-card'],
                styles['PNL-card'],
                'card'
            )}
            >
                <AreaChart 
                    dates={[]} 
                    values={[]} 
                    title={
                        <ToolTip 
                            title={'PnL'}
                            infoText={'PNL (Profit and Loss) – это величина, которая показывает разницу между прибылью и убытками в трейдинге.'}
                        />
                    }
                />
            </div>
            <div className={classNames(
                styles['investor-view-card'],
                styles['ROE-card'],
                'card',
            )}
            >
                <AreaChart
                    dates={graphicData.dates}
                    values={graphicData.roeValues}
                    title={
                        <ToolTip
                            title={'ROE'}
                            infoText={'ROE — это та процентная ставка, под которую в компании работают средства акционеров. Этот показатель является ключевым для определения эффективности деятельности компании. Например, показатель ROE = 20% говорит о том, что каждый рубль, вложенный в компанию, ежегодно приносит 20 копеек прибыли.'}
                        />
                    }
                />
            </div>
        </>
    );
};

export default InvestorView;
