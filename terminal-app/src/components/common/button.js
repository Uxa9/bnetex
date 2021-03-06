/**
 * Компонент кнопки
 * @param {String} type - тип кнопки:
 *  primary (default), secondary, accept, decline
 * @param {Number} width - ширина кнопки
 * @param {Number} height - высота кнопки
 */
const Button = props => {

    return (
        <div
            className={`button button-${props.type || 'primary'}`}
            style={{
                width  : props.width  || '200px',
                height : props.height || '50px'
            }}
            onClick={props.onClickFunc}
        >
            {props.children}
        </div>
    )
}

export default Button;