import { useState, useEffect, useRef } from 'react';

import Header from './components/pageTemplate/header';

import abstractImg from './images/main__abstract-line.svg'
import { NumInput } from './components/UIKit';

const App = props => {

    return (
        <div
            className="page-wrapper"
        >
            <Header />
            <div
                className="content-wrapper"
            >
                <section className='mainPage__intro'>
                   <div>
                   <h1 className='intro-text'>
                        Инновационный статистический алгоритм
                        <img src={abstractImg} alt='' />
                    </h1> 

                    <div>
                        <NumInput 
                        />
                    </div>
                   </div>

                </section>
            </div>
        </div>
    );
}

export default App;
