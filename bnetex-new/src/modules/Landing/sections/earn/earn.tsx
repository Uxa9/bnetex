import clsx from 'clsx';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import Blur from 'modules/Global/components/blurredBackgroundItem';
import Chart from 'modules/Global/components/lightChart/chart';
import { useEffect, useState } from 'react';
import { AppLinksEnum } from 'routes/appLinks';
import { getHistoricalData } from 'store/action-creators/roepnl';
import styles from './earn.module.scss';

// toDO: вынести отсюда в redux и использовать там
const historyPeriods = [1, 3, 6, 12] as const;
type HistoryPeriodType = typeof historyPeriods[number];

const Earn = () => {

    const { goToState } = useGoToState();
    const [selectedPeriod, setSelectedPeriod] = useState<HistoryPeriodType>(12);
    const dispatch = useAppDispatch();
    const { loading, dates, roe } = useTypedSelector(state => state.roePnl);

    useEffect(() => {
        dispatch(getHistoricalData(selectedPeriod, 1));
    }, [selectedPeriod]);

    const formatDates = (dates: string[]) => {
        return dates.map(it => {
            const [ year, month, day ] = it.split('-');
            return {
                year: Number(year),
                month: Number(month),
                day: Number(day),
            };
        });
    };

    return(
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                <Blur
                    color={'blue'}
                    top={'0'}
                    left={'-10%'}
                    type={'circle'}
                />
                <Blur
                    color={'purple'}
                    top={'-50%'}
                    left={'0'}
                    type={'circle'}
                />
                <div className={styles['info']}>
                    <h2>Рентабельность собственного <span>капитала</span></h2>
                    <p className={clsx(
                        styles['description'],
                        'text'
                    )}
                    >
                        <span>
                            В основе алгоритма BNETEX, лежат математические правила и статистические модели.
                            Это позволяет получать впечатляющий результат.
                        </span>
                        <span>
                            Убедитесь самостоятельно,
                            посмотрев историю торговли алгоритма:
                        </span>
                    </p>
                    <Button
                        buttonStyle={'primary'}
                        text={'Открыть историю торговли'}
                        className={styles['action-button']}
                        onClick={() => goToState(`${AppLinksEnum.TERMINAL}/investor`)}
                    />
                </div>
                <div className={styles['chart-container']}>
                    <Chart
                        type={'ROE'}
                        className={styles['chart']}
                        // toDo: вырезать в отдельную функцию
                        data={dates.map((date, index) => {
                            const [ year, month, day ] = date.split('-');
                            const time = {
                                year: Number(year),
                                month: Number(month),
                                day: Number(day),
                            };
                            return {
                                time: time,
                                value: roe[index],
                            };
                        })}
                        loading={loading}
                        comissionSwitch={false}
                    />
                    {/* <ToggleButtonGroup
                        onChange={setSelectedPeriod}
                        value={selectedPeriod}
                        name={'landingPeriodSelector'}
                        asNumber
                    >
                        {
                            historyPeriods.map(it =>
                                <ToggleButton
                                    value={it}
                                    key={it}
                                    text={`${it} мес.`}
                                />
                            )
                        }
                    </ToggleButtonGroup> */}
                </div>
            </div>
        </section>
    );
};

export default Earn;
