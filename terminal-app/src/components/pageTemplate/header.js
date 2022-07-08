import NightMode from "../../images/icons/nightMode";
import Wallet    from "../../images/icons/wallet";
import Case      from "../../images/icons/case";
import User      from "../../images/icons/user";

/**
 * 
 */
const Header = () => {

    return (
        <header>
            <div>
                <div
                    className="logo"
                >

                </div>
                <select>
                    <option>
                        Начинающий
                    </option>
                    <option>
                        Уверенный
                    </option>
                    <option>
                        Pro-версия
                    </option>
                </select>
            </div>
            <div>
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