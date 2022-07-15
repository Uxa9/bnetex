import Cross from "../../images/icons/delete";

const PopUp = props => {

    return (
        <div
            className="popup-container"
        >
            <div
                className="popup-background"
                onClick={() => alert('aboba')}
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
                    <Cross />
                </div>
                <div
                    className="popup-content"
                >
                    {props.children}
                </div>
                <div
                    className="popup-bottom-button button button-primary"
                >
                    {props.confirmText || "Подтвердить"}
                </div>
            </div>            
        </div>
    )
}

export default PopUp;