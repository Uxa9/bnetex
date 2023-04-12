import axios from 'axios';
import clsx from 'clsx';
import { useToast } from 'lib/hooks/useToast';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';import { getUserPositions } from 'services/trading/getUserPositions';
import { sendFuturesOrder } from 'services/trading/sendFuturesOrder';
import { convertPricesByTick } from './services/convertPricesByTick';
import styles from './cup.module.scss';
import renderTradeCup from './renderTradeCup';
import RenderTradeCup from './renderTradeCup';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';

const TraderCup = (props: any) => {

    const { asks, bids, price } = useTypedSelector(state => state.tradePair);
    const { amount } = props;

    return (
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
            <RenderTradeCup
                amount={amount}
            />
        </div>
    );
};


export default TraderCup;
