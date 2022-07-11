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
                        <option value="pro">
                            Pro-версия
                        </option>
                    </select>
                </div>
            </div>
            <div
                className="header-right-side"
            >
                <div>
                    <NightMode />
                </div>
                <div>
                    <Wallet />
                    <span>
                        Кошельки
                    </span>
                </div>
                <div>
                    <Case />
                    <span>
                        Депозиты
                    </span>
                </div>
                <div>
                    <User />
                    <span>
                        Профиль
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header;