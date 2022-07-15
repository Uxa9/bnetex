import Button from './components/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/pageTemplate/popUp';

import './styles/style.scss';

const App = () => {
    return (
        <>
            <Header />
            <PopUp 
                title="BTC/USDT бессрочный режим маржи"
            />
        </>
    );
}

export default App;
