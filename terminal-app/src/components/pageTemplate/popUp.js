import Cross from "../../images/icons/delete";

const PopUp = props => {

    return (
        <div
            className="popup-container"
        >
            <div
                className="popup-header"
            >
                <h3>
                    {props.title}
                </h3>
                <Cross />
            </div>
            
        </div>
    )
}