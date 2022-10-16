import { FC, ReactNode } from 'react';
import {Cross} from '../../assets/images/icons';

import Button from './button/button';

interface PopUpProps{
    closeFunc: () => any,
    acceptFunc: () => any,
    title: string,
    confirmText?: string,
    confirmButtonTheme?: 'accent' | 'green' | 'red',
    children: ReactNode,
    disabled?: boolean
}

const PopUp:FC<PopUpProps> = props => {

const {closeFunc, acceptFunc, title, confirmText, confirmButtonTheme = 'accent', children, disabled} = props;

    return (
        <div
            className="popup-container"
        >
            <div
                className="popup-background"
                onClick={closeFunc}
            />
            <div
                className="popup"
            >
                <div
                    className="popup-header"
                >
                    <span>
                        {title}
                    </span>
                    <div
                        onClick={closeFunc}
                    >
                        <Cross 
                            height={'24px'}
                            width={'24px'}
                        />
                    </div>    
                </div>
                <div
                    className="popup-content"
                >
                    {children}
                </div>
                <Button
                    className="popup-bottom-button"
                    buttonTheme={confirmButtonTheme}
                    disabled={disabled}
                    onClick={acceptFunc}
                >
                    {confirmText ?? 'Подтвердить'}
                </Button>
            </div>            
        </div>
    );
};

export default PopUp;
