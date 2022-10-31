import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView   from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import AreaChart from './chart/areaChart';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import classNames from 'classnames';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';

type InvestorViewType = 'trade' | 'history';

const InvestorView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');

    return (
        <>
            <div
                className={classNames(
                    styles['investor-view-card'],
                    styles['actions-card'],
                    'card'
                )}
            >
                <div className={styles['toggle-group-container']}>
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
                        className={styles['history-tooltip']}
                    />
                </div>
                {
                    viewType === 'trade' ? 
                        <TradeView /> :
                        <HistoryView />
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
                    <span className={'subtitle'}>
                        21 643.35 USDT
                    </span>
                    <SignedNumber 
                        value={0}
                        postfix={'%'}
                        className={'text'}
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
                    dates={[]} 
                    values={[]} 
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
