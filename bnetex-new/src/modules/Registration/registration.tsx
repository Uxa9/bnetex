import Blur from "components/blurredBackgroundItem";
import { Button, Input } from "lib/ui-kit";

import styles from './registration.module.scss';


const Registration = () => {

    return (
        <div>
            <div
                className="background-blur"
            >
                <Blur 
                    color={'purple'}
                    top={'0'}
                    left={'0'} 
                    type={'ellipse'}
                    rotate={-165}
                />
                <Blur 
                    color={'blue'}
                    top={'-10%'}
                    left={'30%'} 
                    type={'ellipse'}
                />
                <Blur 
                    color={'green'}
                    top={'-30%'}
                    left={'-10%'} 
                    type={'circle'}
                />        
            </div>
            <div
                className={styles['reg-container']}
            >
                <div
                    className="block"
                >
                    <h2>
                        Аккаунт
                    </h2>
                    <p>
                        Введите адрес электронной почты и выберите надежный пароль.
                    </p>

                    <Input
                        label="Email или телефон*"
                        hasBackground={false}
                    />
                    <Input
                        label="Пароль*"
                        hasBackground={false}
                    />

                    <Button
                        buttonStyle="primary"
                        text="Далее"
                    />


                </div>
            </div>
        </div>
    )
}

export default Registration;