import RadioButton from 'lib/ui-kit/radioButton/radioButton';
import RadioButtonGroup from 'lib/ui-kit/radioButton/radioButtonGroup';
import styles from './settingsMenu.module.scss'

const SettingsMenu = () => {

    const handleTerminalTypeChange = (value: string | number) => {
        console.log(value)
    }

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
        </div>
    )
}

export default SettingsMenu;