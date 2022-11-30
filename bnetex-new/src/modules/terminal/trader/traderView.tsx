import { useState } from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import clsx from 'clsx';
import styles from './traderView.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import MarginPopUp from './components/modals/marginPopUp';
import LeverPopUp from './components/modals/leverPopUp';
import { useModal } from 'lib/hooks/useModal';

type InvestorViewType = 'trade' | 'history';

const TradeView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');
    const { dates, roe, pnl, loading } = useTypedSelector(state => state.roePnl);

    const { open: OpenLeverModal } = useModal(LeverPopUp);
    const { open: OpenMarginModal } = useModal(MarginPopUp);

    return (
        <div
            className={clsx(styles['trade-layout'])}
        >
            <div
                className={clsx('card', styles['cup'])}
            >
                <div
                    className={clsx(styles['cup-head'])}
                >
                    <span>
                        Объем (USDT)
                    </span>
                    <span>
                        Цена (USDT)
                    </span>
                </div>
                <div
                    className={clsx(styles['cup-position'])}
                >
                    <span>
                        1.1
                    </span>
                    <span>
                        16001.00
                    </span>
                </div>
                <div
                    className={clsx(styles['cup-position'])}
                >
                <span>
                        1.5
                    </span>
                    <span>
                        16000.00
                    </span>
                </div>
            </div>
            <div
                className={clsx('card', styles['trade-panel'])}
            >
                <div
                    className={styles['trader-view-wrapper__header']}
                >
                    <Button
                        buttonStyle="secondary"
                        text="Перекрестная"
                        onClick={() => OpenMarginModal({
                            type: 'isolated',
                            hasOrder: false,
                            onClose: function (): void {
                                throw new Error('Function not implemented.');
                            },
                            acceptFunc: function (value: any): void {
                                throw new Error('Function not implemented.');
                            }
                        })}
                    />
                    <Button
                        buttonStyle="secondary"
                        text="10x"
                        onClick={() => OpenLeverModal({
                            lever: 0,
                            acceptFunc: function (value: any): void {
                                throw new Error('Function not implemented.');
                            },
                            onClose: function (): void {
                                throw new Error('Function not implemented.');
                            }
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default TradeView;
