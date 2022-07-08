import Button from './components/button';
import Header from './components/pageTemplate/header';

import './styles/style.scss';

const App = () => {
    return (
        <>
            <Header />
            <Button
                text="aboba"
                type="decline"
            />
        </>
    );
}

export default App;
