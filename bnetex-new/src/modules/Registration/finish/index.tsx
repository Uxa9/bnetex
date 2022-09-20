import { CircledCheck } from "assets/images/icons";
import classNames from "classnames";
import { Button } from "lib/ui-kit";
import { useNavigate } from "react-router-dom";
import RegistrationTemplate from "../registrationTemplate";

import styles from './finish.module.scss';

const Finish = () => {

    const navigate = useNavigate();

    return (
        <RegistrationTemplate>
            <div
                className={classNames('block', styles['content-wrapper'])}
            >
                <div
                    className={styles['header']}
                >
                    <CircledCheck 
                        className={styles['circle-check']}
                    />
                    <h2
                        className={classNames('text-main', styles['container-header'])}
                    >
                        Аккаут создан!
                    </h2>
                </div>
                <p
                    className={classNames("text-main", styles['container-text'])}
                >
                    Спасибо, что выбрали BNETEX! 
                    Теперь вы можете перейти к пополнению 
                    кошелька и торговле на бирже в нашем 
                    революционном терминале.
                </p>
                <div
                    className={styles['button-wrapper']}
                >
                    <Button
                        form="signupForm"
                        buttonStyle="primary"
                        text="Перейти в кошелек"
                        onClick={() => navigate('../../../dashboard/wallet/main')}
                    />
                </div>
            </div>
        </RegistrationTemplate>
    )
}

export default Finish;