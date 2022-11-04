import { ModalSpawnerProvider } from 'lib/hooks/useModal';
import { PromiseWithLoadingProvider } from 'lib/hooks/usePromiseWithLoading';
import { ThemeProvider } from 'lib/hooks/useTheme';
import { ToastProvider } from 'lib/hooks/useToast';
import ModalSpawner from 'modules/Global/components/ModalSpawn/ModalSpawner/modalSpawner';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from 'routes/appRoutes';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <PromiseWithLoadingProvider>
                        <ModalSpawnerProvider>
                            <AppRoutes />
                            <ModalSpawner />
                        </ModalSpawnerProvider>
                    </PromiseWithLoadingProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
