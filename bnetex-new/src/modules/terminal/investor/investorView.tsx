import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import classNames from 'classnames';
import { getHistoricalData } from 'services/getHistoricalData';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import InvestorChart from 'modules/Global/components/investorChart/investorChart';

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
        roeValues: [],
    });
    const [investProfit, setInvestProfit] = useState(0);
    const [investPercentProfit, setInvestPercentProfit] = useState(0);

    const getData = async (period: number, amount: number) => {
        const res = await getHistoricalData(period, amount);

        setGraphicData({
            dates: res.dates,
            pnlValues: res.pnlValues.map((item: any) => Number(Number(item).toFixed(2))),
            roeValues: res.roeValues.map((item: any) => Number(Number(item).toFixed(2))),
        });

        await setInvestPercentProfit(res.roeValues[res.roeValues.length - 1]);
        await setInvestProfit(res.roeValues[res.roeValues.length - 1] * amount / 100);

        return;
    };

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
                    infoText='Доход инвестора это PNL алгоритма за вычетом комиссии BNETEX (50%), от суммы переданной алгоритму.'
                />
                <div
                    className={styles['data-card__row']}
                >
                    <span
                        className={'subtitle'}
                    >
                        {Number(Number(investProfit).toFixed(2))}
                    </span>
                    <SignedNumber 
                        value={Number(Number(investPercentProfit).toFixed(2))}
                        postfix={'%'}
                    />
                </div>
            </div>
            <div className={classNames(
                styles['investor-view-card'],
                styles['PNL-card'],
                'card'
            )}
            >
                <InvestorChart 
                    dates={graphicData.dates}
                    values={graphicData.pnlValues}
                    type={'PNL'}
                />
            </div>
            <div className={classNames(
                styles['investor-view-card'],
                styles['ROE-card'],
                'card',
            )}
            >
                <InvestorChart 
                    dates={graphicData.dates}
                    values={graphicData.roeValues}
                    type={'ROE'}
                />
            </div>
        </>
    );
};

export default InvestorView;
