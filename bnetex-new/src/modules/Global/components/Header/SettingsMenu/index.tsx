import { useActions } from 'lib/hooks/useActionCreators';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { OrderBookStep, OrderBookStyle, TerminalType } from 'lib/types/terminal';
import { ToggleButton } from 'lib/ui-kit';
import RadioButton from 'lib/ui-kit/radioButton/radioButton';
import RadioButtonGroup from 'lib/ui-kit/radioButton/radioButtonGroup';
import ToggleButtonGroup from 'lib/ui-kit/toggleButton/toggleButtonGroup';
import { useMemo } from 'react';
import styles from './settingsMenu.module.scss';

const SettingsMenu = () => {

    const {terminalType, orderBookStep, orderBookStyle} = useTypedSelector(state => state.terminal);
    const {changeTerminalType, changeOrderBookStep, changeOrderBookStyle} = useActions();

    // Можно попробовать сразу передавать внутренние dispatch-функции в компоненты
    const handleTerminalTypeChange = (value: TerminalType) => {
        changeTerminalType(value);
    };

    const handleStepChange = (value: OrderBookStep) => {
        changeOrderBookStep(value);
    };

    const handleOrderBookStyleChange = (value: OrderBookStyle) => {
        changeOrderBookStyle(value);
    };

    return (
        <div className={styles.menu}>
            {/* <RadioButtonGroup
                title='Тип терминала'
                onChange={handleTerminalTypeChange}
                name={'terminalType'}
                value={useMemo(() => terminalType, [terminalType])}
            >
                <RadioButton
                    label='Начинающий'
                    value={'beginner'}
                />
                <RadioButton
                    label='Продвинутый'
                    value={'advanced'}
                />
                <RadioButton
                    label='Инвестор'
                    value={'investor'}
                />
            </RadioButtonGroup> */}

            <ToggleButtonGroup
                title='Шаг цены в стакане'
                name='Step'
                value={orderBookStep}
                exclusive
                onChange={handleStepChange}
                asNumber
            >
                <ToggleButton 
                    text='0.1'
                    value={0.1}
                    location='left'
                />
                <ToggleButton 
                    text='1'
                    value={1}
                />
                <ToggleButton 
                    text='10'
                    value={10}
                    location='right'
                />
                {/* <ToggleButton 
                    text='50'
                    value={50}
                />
                <ToggleButton 
                    text='100'
                    value={100}
                    location='right'
                /> */}
            </ToggleButtonGroup>
        </div>
    );
};

export default SettingsMenu;
