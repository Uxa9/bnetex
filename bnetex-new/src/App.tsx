import { WebsocketProvider, socket } from './context/WebsocketContext';
import { ModalSpawnerProvider } from 'lib/hooks/useModal';
import { CurrentPlatformProvider } from 'lib/hooks/usePlatform';
import { PromiseWithLoadingProvider } from 'lib/hooks/usePromiseWithLoading';
import { ThemeProvider } from 'lib/hooks/useTheme';
import { ToastProvider } from 'lib/hooks/useToast';
import { checkImageFormatSupport, ImageFormat } from 'lib/utils/checkImageFormatSupport';
import ModalSpawner from 'modules/Global/components/ModalSpawn/ModalSpawner/modalSpawner';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from 'routes/appRoutes';

function App() {

    useEffect(() => {
        // Проверка наилучшего формата изображений, поддерживаемого браузером пользователя (avif, webp, png)
        checkImageFormatSupport()
            .then((format: ImageFormat) => localStorage.setItem('availableImageFormat', format));

        return () => localStorage.removeItem('pendingFreeTimeRequest');
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider>
                <CurrentPlatformProvider>
                    <ToastProvider>
                        <PromiseWithLoadingProvider>
                            <ModalSpawnerProvider>
                                <WebsocketProvider value={socket}>
                                    <AppRoutes />
                                    <ModalSpawner />
                                </WebsocketProvider>
                            </ModalSpawnerProvider>
                        </PromiseWithLoadingProvider>
                    </ToastProvider>
                </CurrentPlatformProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
