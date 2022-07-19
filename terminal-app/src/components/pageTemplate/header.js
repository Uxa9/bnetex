import NightMode from "../../images/icons/nightMode";
import Wallet    from "../../images/icons/wallet";
import Case      from "../../images/icons/case";
import User      from "../../images/icons/user";
import logo      from "../../images/logo.svg";

/**
 * 
 */
const Header = () => {

    return (
        <header
            className="page-header"
        >
            <div
                className="header-left-side"
            >
                <div
                    className="logo"
                >
                    <img src={logo} />
                </div>
                <div
                    className="custom-select"
                >
                    <select>
                        <option value="beginner">
                            Начинающий
                        </option>
                        <option value="advanced">
                            Уверенный
                        </option>
                        <option value="pro" disabled>
                            Pro-версия
                        </option>
                    </select>
                </div>
            </div>
            <div
                className="header-right-side"
            >
                <div>
                    <NightMode 
                        height='22px'
                        width='22px'
                    />
                </div>
                <div>
                    <Wallet 
                        height='22px'
                        width='22px'
                    />
                    <span>
                        Кошельки
                    </span>
                </div>
                <div>
                    <Case
                        height='22px'
                        width='22px' 
                    />
                    <span>
                        Депозиты
                    </span>
                </div>
                <div>
                    <User
                        height='22px'
                        width='22px' 
                    />
                    <span>
                        Профиль
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header;