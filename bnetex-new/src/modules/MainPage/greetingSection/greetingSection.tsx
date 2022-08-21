import classNames from 'classnames';
import { Button, Input } from 'lib/ui-kit';
import styles from './greetingSection.module.scss';
import {ReactComponent as GraphicsImg} from '../../../assets/images/landing__graphics.svg';
import { useState } from 'react';
import Blur from 'components/blurredBackgroundItem';

const GreetingSection = () => {

    const [email, setEmail] = useState<string>('');

    // По хорошему надо сделать форму с input:email и button:submit
    // и подписаться на submit event формы
    // у input:email нативная валидация ввода, нужно сделать кастомное сообщение об ошибке

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };

    return(
        <section className={styles['greeting-block']}>

            <Blur 
                color={'purple'}
                top={'0px'}
                left={'0px'} 
                type={'ellipse'}
                rotate={165}
            />

            <Blur 
                color={'blue'}
                top={'50%'}
                left={'20%'} 
                type={'ellipse'}
            />

            <Blur 
                color={'red'}
                top={'20%'}
                left={'40%'} 
                type={'circle'}
            />

            <Blur 
                color={'purple'}
                top={'-20%'}
                left={'40%'} 
                type={'circle'}
            />
            
            <div className={styles['greeting-text']}>
                <h1>Инновационный статистический <span>алгоритм</span></h1>
                <p 
                    className={classNames('body-1', styles['extra-text'])}
                >
                   Интерактивный сигнальный индикатор выведет вашу торговлю на совершенно новый уровень.
                    <p>Торгуйте как профессионал. Это просто. </p>
                </p>

                <div className={styles['greeting-text__input-block']}>
                    <Input 
                        label='Email'
                        hasBackground
                        type={'email'}
                        onChange={handleInput}
                    />
                    <Button 
                        text='Регистрация'
                        buttonStyle='primary'
                    />
                </div>
            </div>
            <GraphicsImg 
                className={classNames('svg-fill', styles['greeting-img'])}
            />
        </section>
    );
};

export default GreetingSection;
