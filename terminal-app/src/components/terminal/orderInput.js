
const OrderInput = props => {

    return (
        <input
            disabled={props.disabled}
            value={props.value}
            className="amount-selector user-selector-field"
        />
    );
}

export default OrderInput;