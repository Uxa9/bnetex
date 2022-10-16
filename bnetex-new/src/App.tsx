import { PromiseWithLoadingProvider } from 'lib/hooks/usePromiseWithLoading';
import { ThemeProvider } from 'lib/hooks/useTheme';
import { ToastProvider } from 'lib/hooks/useToast';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from 'routes/appRoutes';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <PromiseWithLoadingProvider>
                        <AppRoutes />
                    </PromiseWithLoadingProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
