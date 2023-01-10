import { useState, useEffect, useRef, FC } from 'react';
import styles from './leverPopUp.module.scss';
import PopUp from 'lib/ui-kit/popUp';

import {Info} from 'assets/images/icons';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import clsx from 'clsx';
import {BaseModalProps} from "../../../../../lib/hooks/useModal";
import {getLeverageBrackets} from "../../../../../services/trading/getLeverageBrackets";
import {setUserLeverage} from "../../../../../services/trading/setUserLeverage";
import {Button} from "../../../../../lib/ui-kit";

interface LeverBreakpoint {
    value: number,
    capacity: number,
    floor?: number
}

const LeverPopUp = (props: { lever: number } & BaseModalProps) => {

    const { onClose } = props;
    const [lever, setLever] = useState<number>(props.lever);
    const [maxLever, setMaxLever] = useState<number>(0);
    const [maxSum, setMaxSum] = useState<number>(500000000);
    const [sliderLever, showSliderLever] = useState(false);
    const [breakpoints, setBreakPoints] = useState<LeverBreakpoint[]>([]);
    const slider = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLever(props.lever);

        getLeverageBrackets()
            .then(async (res) => {
                // ну это другим словом не назовешь
                const aboba = await (res.data[0].brackets.map((bracket: any) => {
                    return {
                        value : bracket.initialLeverage,
                        capacity : bracket.notionalCap,
                        floor : bracket.notionalFloor
                    }
                }));

                await aboba.sort(( a: any, b: any ) => {
                    if ( a.value < b.value ){
                        return -1;
                    }
                    if ( a.value > b.value ){
                        return 1;
                    }
                    return 0;
                });

                setBreakPoints(aboba);
                setMaxLever(aboba[aboba.length - 1].lever);

            });
    }, []);

    // Тут надо почище сделать. Это пиздец)
    useEffect(() => {
        if(slider !== null){
            //@ts-ignore
            slider.current.value = lever.toString();
            //@ts-ignore
            slider.current.style.background =
                'linear-gradient(to right, #9043CA 0%, #9043CA ' +
                lever/(maxLever / 100 || 1) + '%, #F9F1FF ' +
                lever/(maxLever / 100 || 1) + '%, #F9F1FF 100%)';
        }

        const bp = breakpoints.find(item => item.value === lever)

        if (bp !== undefined) {
            setMaxSum(bp.capacity);
        }

    }, [lever]);

    const lowerLever = () => {
        if ( lever > 1 ) {
            setLever(Number(lever) - 1);
        }
    };

    const upperLever = () => {
        if ( lever < maxLever ) {
            setLever(Number(lever) + 1);
        }
    };

    const setLeverage = async () => {
        await setUserLeverage({lever});
    }
    console.log(breakpoints);
    console.log(maxLever);
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
                max={maxLever}
                defaultValue={lever}
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
                    label={`1x`}
                    className={
                        `${lever > 1 && styles['passed']}`
                    }
                    onClick={() => setLever(1)}
                />
            </datalist>
            <div
                className={styles["lever-info"]}
            >
                <ul>
                    <li>
                        <span>
                            {"Максимальная позиция при текущем кредитном плече:"}
                        </span>
                        <b>
                            {` ${maxSum} USDT`}
                        </b>
                    </li>
                    <li>
                        {"Пожалуйста, учтите, что кредитное плечо будет также применено для открытых позиций и открытых ордеров"}
                    </li>
                </ul>
                {lever > 10 &&
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
                }
            </div>
            <Button
                text={"Подтвердить"}
                fillContainer
                onClick={() => {
                    setLeverage();
                    onClose();
                }}
            />
        </Modal>
    );
};

export default LeverPopUp;
