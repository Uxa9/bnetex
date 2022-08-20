import { Button } from 'lib/ui-kit';
import { FC } from 'react';
import styles from './settingItem.module.scss';
import {CircledCross, CircledCheck} from '../../../../assets/images/icons';

export interface SettingItemProps{
    title: string,
    activeStateText?: string,
    editable?: boolean,
    hasActiveState?: boolean
}

/**
 * 
 * @param title - название настройки
 * @param activeStateText - значение настройки (номер телефона, еmail и др.). Если пустая строка или не передано значение,
 * не показывается кнопка "Включить/Выключить"
 * @param Editable Показывать/скрыть кнопку "Изменить"
 * 
 * @returns 
 */

const SettingItem:FC<SettingItemProps> = props => {

    const { title, activeStateText, editable, hasActiveState} = props;

    return(
        <div className={styles.setting}>
            <p className='body-1'>{title}</p>
            
            {
                hasActiveState &&
                <div className={styles['active-state']}>
                    {
                        activeStateText ? 
                            <CircledCheck
                                className={styles['icon-checkmark']}
                            /> : 
                            <CircledCross 
                                className={styles['icon-cross']}
                            />
                    }   
                    <p className='body-1'>
                        {activeStateText ? activeStateText : 'Не привязано'}    
                    </p>              
                </div>
            }
            <div className={styles.buttons}>
                {
                    hasActiveState && 
                    <Button
                        buttonStyle={activeStateText ? 'decline' : 'accept'}
                        className={styles.button}
                    >
                        {activeStateText ? 'Выключить' : 'Включить'}
                    </Button>
                }
                {
                    editable && 
                    <Button 
                        className={styles.button}
                    >
                        Изменить
                    </Button>
                }
            </div>
        </div>
    );
};

export default SettingItem;
