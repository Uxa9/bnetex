import Cross from "../../images/icons/delete";

import Button from "./button";

const PopUp = props => {

    return (
        <div
            className="popup-container"
        >
            <div
                className="popup-background"
                onClick={props.closeFunc}
            />
            <div
                className="popup"
            >
                <div
                    className="popup-header"
                >
                    <span>
                        {props.title}
                    </span>
                    <div
                        onClick={props.closeFunc}
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
                    {props.children}
                </div>
                <Button
                    height="50px"
                    width="100%"
                    className="popup-bottom-button"
                    type={props.confirmType || "primary"}
                    onClickFunc={props.acceptFunc}
                >
                    {props.confirmText || "Подтвердить"}
                </Button>
            </div>            
        </div>
    )
}

export default PopUp;