import { ToastProvider } from 'lib/hooks/useToast';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from 'routes/appRoutes';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AppRoutes />
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
