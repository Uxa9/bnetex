import { useState, useEffect, useRef, FC } from 'react';
import styles from './leverPopUp.module.scss';
import PopUp from 'lib/ui-kit/popUp';

import {Info} from 'assets/images/icons';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import clsx from 'clsx';
import {BaseModalProps} from "../../../../../lib/hooks/useModal";

const LeverPopUp = (props: { lever: number } & BaseModalProps) => {

    const MAX_SUM = 300000000;

    const { onClose } = props;
    const [lever, setLever] = useState<number>(1);
    const [maxSum, setMaxSum] = useState<number>(MAX_SUM);
    const [sliderLever, showSliderLever] = useState(false);
    const slider = useRef<HTMLInputElement>(null);

    const lowerLever = () => {
        if ( lever > 1 ) {
            setLever(Number(lever) - 1);
        }
    };

    const upperLever = () => {
        if ( lever < 125 ) {
            setLever(Number(lever) + 1);
        }
    };

    useEffect(() => {
        setLever(props.lever);
    }, []);
    
    // Тут надо почище сделать. Это пиздец)
    useEffect(() => {
        if(slider !== null){
            //@ts-ignore
            slider.current.value = lever.toString();
            //@ts-ignore
            slider.current.style.background = 
                'linear-gradient(to right, #9043CA 0%, #9043CA ' + 
                lever/1.25 + '%, #F9F1FF ' + 
                lever/1.25 + '%, #F9F1FF 100%)';
        }

        if (lever >= 101) {
            setMaxSum(50000);
            return;
        }
        if (lever >= 51) {
            setMaxSum(250000);
            return;
        }
        if (lever >= 21) {
            setMaxSum(1000000);
            return;
        }
        if (lever >= 11) {
            setMaxSum(10000000);
            return;
        }
        if (lever >= 6) {
            setMaxSum(20000000);
            return;
        }
        if (lever >= 5) {
            setMaxSum(50000000);
            return;
        }
        if (lever >= 4) {
            setMaxSum(100000000);
            return;
        }
        if (lever >= 3) {
            setMaxSum(200000000);
            return;
        }
        if (lever >= 2) {
            setMaxSum(300000000);
            return;
        }
    }, [lever]);

    return (
        <Modal
            title={"Изменить кредитное плечо"}
            onClose={onClose}
            className={clsx(
                styles['content'],
                'text'
            )}
        >
            <span
                className={styles["credit-lever-header"]}
            >
                {"Кредитное плечо"}
            </span>
            <div
                className={styles["credit-lever-display"]}
            >
                <div 
                    className={styles["minus-icon"]}
                    onClick={lowerLever}
                />
                <div
                    className={styles["credit-lever-level"]}
                >
                    {lever}x
                </div>
                <div
                    className={styles["plus-icon"]}
                    onClick={upperLever}
                />
            </div>
            <div
                className={styles["slider-lever-container"]}
                style={{
                    opacity: sliderLever ? 1 : 0,
                    marginLeft: `${lever/1.32}%`,
                }}
            >
                <span>
                    {lever}x
                </span>
            </div>
            <input
                type='range'
                min={1}
                max={125}
                defaultValue={1}
                list="leverageList"
                onChange={e => setLever(e.target.valueAsNumber)}
                onMouseEnter={() => showSliderLever(true)}
                onMouseLeave={() => showSliderLever(false)}
                className={styles["lever-range-selector"]}
                ref={slider}
            />
            <datalist
                className={styles["leverage-list"]}
                id="leverageList"
            >
                <option
                    value={1}
                    label="1x"
                    className={
                        `${lever > 1 && styles['passed']}`
                    }
                    onClick={() => setLever(1)}
                />
                <option
                    value={25}
                    label="25x"
                    className={
                        `${lever > 25 && styles['passed']}`
                    }
                    onClick={() => setLever(25)}
                />
                <option
                    value={50}
                    label="50x"
                    className={
                        `${lever > 50 && styles['passed']}`
                    }
                    onClick={() => setLever(50)}
                />
                <option
                    value={75}
                    label="75x"
                    className={
                        `${lever > 75 && styles['passed']}`
                    }
                    onClick={() => setLever(75)}
                />
                <option
                    value={100}
                    label="100x"
                    className={
                        `${lever > 100 && styles['passed']}`
                    }
                    onClick={() => setLever(100)}
                />
                <option
                    value={125}
                    label="125x"
                    className={
                        `${lever > 125 && styles['passed']}`
                    }
                    onClick={() => setLever(125)}
                />
            </datalist>
            <div
                className={styles["lever-info"]}
            >
                <ul>
                    <li
                        style={{
                            maxHeight: lever > 1 ? 'none' : 0,
                        }}
                    >
                        <span>
                            {"Максимальная позиция при текущем кредитном плече:"}
                        </span>
                        <b>
                            {`${maxSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} USDT`}
                        </b>
                    </li>
                    <li>
                        {"Пожалуйста, учтите, что кредитное плечо будет также применено для открытых позиций и открытых ордеров"}
                    </li>
                </ul>
                <div
                    className={styles["lever-warn"]}
                >
                    <Info 
                        height='25px'
                        width='25px'
                    />
                    <span>
                        {"Торговля с кредитным плечом, превышающим 10х, увеличивает риск принудительной ликвидации. \nВсегда контролируйте уровень риска."}
                    </span>
                </div>
            </div>
        </Modal>
    );
};

export default LeverPopUp;
