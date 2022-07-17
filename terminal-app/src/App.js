import Button from './components/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/popUp';

import './styles/style.scss';

const App = () => {
    return (
        <>
            <Header />
            <PopUp 
                title="Изменить кредитное плечо"
            >
                <span>
                    Кредитное плечо
                </span>
                <div
                    className="credit-lever-display"
                >
                    <div 
                        className="minus-icon"
                    />
                    <div
                        className="credit-lever-level"
                    >
                        1x
                    </div>
                    <div
                        className="plus-icon"
                    />
                </div>
            </PopUp>
        </>
    );
}

export default App;
