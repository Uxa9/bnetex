import { useState, useEffect, useRef } from 'react';

import regBg from '../src/images/regBg.png';
import abstractImg from '../src/images/abstractImage.svg';

import '../src/styles/style.scss'
import { Button } from './components/UIKit';

const App = props => {

    return (
        <div
            className='page-wrapper'
            style={{
                background : `url(${regBg})`,
                backgroundSize : 'cover',
                backgroundPosition : 'center',
                width: '100vw',
                height: '100vh'
            }}
        >
            <div
                className='registration-wrapper'
            >
                <div
                    className='block'
                >
                    <p
                        className='reg-header'
                    >
                        Добро пожаловать!
                    </p>
                    <p
                        className='reg-subheader'
                    >
                        Войдите, чтобы получить доступ к торговле на бирже BNETEX.
                    </p>
                    <div
                        className='text-input'
                    >
                        <span>
                            Email или телефон *
                        </span>
                        <input
                        />
                    </div>
                    <div
                        className='text-input'
                    >
                        <span>
                            Пароль *
                        </span>
                        <input
                            type={'password'}
                        />
                    </div>
                    <Button
                        type="primary"
                        width="100%"
                    >
                        Войти
                    </Button>
                    <p
                        className='reg-forget'
                    >
                        Забыли пароль?
                    </p>
                    <p
                        className='reg-noacc'
                    >
                        Нет аккаунта? 
                        <span>
                            {' Зарегистрироваться'}
                        </span>
                    </p>
                </div>
                <img
                    src={abstractImg}
                />
            </div>
        </div>
    );
}

export default App;
