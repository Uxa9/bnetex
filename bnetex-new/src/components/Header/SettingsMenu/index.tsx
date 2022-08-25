import { ToggleButton } from 'lib/ui-kit';
import RadioButton from 'lib/ui-kit/radioButton/radioButton';
import RadioButtonGroup from 'lib/ui-kit/radioButton/radioButtonGroup';
import ToggleButtonGroup from 'lib/ui-kit/toggleButton/toggleButtonGroup';
import styles from './settingsMenu.module.scss';

const SettingsMenu = () => {

    const handleTerminalTypeChange = (value: string | number) => {
        console.log(value);
    };

    const handleStepChange = (value: string | number, name?: string) => {
        console.log(value, name);
    };

    return (
        <div className={styles.menu}>
            <RadioButtonGroup
                title='Тип терминала'
                onChange={handleTerminalTypeChange}
                name={'terminalType'}
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
            </RadioButtonGroup>

            <ToggleButtonGroup
                title='Шаг цены в стакане'
                name='Step'
                exclusive
                onChange={handleStepChange}
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
                />
                <ToggleButton 
                    text='50'
                    value={50}
                />
                <ToggleButton 
                    text='100'
                    value={100}
                    location='right'
                />
            </ToggleButtonGroup>
        </div>
    );
};

export default SettingsMenu;
