import { FC, ReactNode } from "react";
import Cross from "../../images/icons/delete";

import Button from "./button";

interface PopUpProps{
    closeFunc: () => any,
    acceptFunc: () => any,
    title: string,
    confirmText: string,
    confirmType?: 'submit' | 'reset' | 'button',
    children: ReactNode
}

const PopUp:FC<PopUpProps> = props => {

    const {closeFunc, acceptFunc, title, confirmText, confirmType, children} = props;

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
                    height="50px"
                    width="100%"
                    className="popup-bottom-button"
                    type={confirmType ?? "button"}
                    onClick={acceptFunc}
                >
                    {confirmText ?? "Подтвердить"}
                </Button>
            </div>            
        </div>
    )
}

export default PopUp;