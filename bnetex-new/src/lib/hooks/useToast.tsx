import { Toast } from 'lib/types/toast';
import { UUID } from 'lib/types/uuid';
import { mapError } from 'lib/utils/errorMap';
import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

const toastContext = createContext<ToastContext | null>(null);

export interface ToastContext {
    toaster: Map<UUID, Toast>;
    bakeToast: BakeToast;
    deleteToast(id: UUID): void;
}

interface BakeToast {
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
}

export const useToast = () => useContext(toastContext) 
    ?? throwError('useToast can be used only inside ToastProvider');

export function ToastProvider({children}: {children: ReactNode}) {
    const [ toaster, setToaster ] = useState<Map<UUID, Toast>>(new Map<UUID, Toast>());

    const bakeToast = {
        error: (message: string) => createToast({id: uuidV4(), type: 'error', text: mapError(message)}),
        success: (message: string) => createToast({id: uuidV4(), type: 'success', text: message}),
        info: (message: string) => createToast({id: uuidV4(), type: 'info', text: message}),
    };

    const deleteToast = (id: UUID) => {
        toaster.delete(id);
        setToaster(new Map<UUID, Toast>(toaster));
    };

    const createToast = (toast: Toast) => {
        setToaster(new Map<UUID, Toast>(toaster.set(toast.id, toast)));
    };

    return (
        <toastContext.Provider
            value={{
                toaster,
                bakeToast,
                deleteToast,
            }}
        >
            {children}
        </toastContext.Provider>
    );
}
