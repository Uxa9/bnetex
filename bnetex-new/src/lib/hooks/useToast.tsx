import { ToastInterface } from 'lib/types/toast';
import { UUID } from 'lib/types/uuid';
import { mapError } from 'lib/utils/errorMap';
import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

const toastContext = createContext<ToastContext | null>(null);

export interface ToastContext {
    toaster: Map<UUID, ToastInterface>;
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
    const [ toaster, setToaster ] = useState<Map<UUID, ToastInterface>>(new Map<UUID, ToastInterface>());

    const bakeToast = {
        error: (message: string, title?: string) => 
            createToast({id: uuidV4(), type: 'error', description: mapError(message), title: title ?? 'Ошибка'}),
        success: (message: string, title?: string) =>
            createToast({id: uuidV4(), type: 'success', description: message, title: title ?? 'Успех'}),
        info: (message: string, title?: string) => 
            createToast({id: uuidV4(), type: 'info', description: message, title: title ?? 'Информация'}),
    };

    const deleteToast = (id: UUID) => {
        toaster.delete(id);
        setToaster(new Map<UUID, ToastInterface>(toaster));
    };

    const createToast = (toast: ToastInterface) => {
        setToaster(new Map<UUID, ToastInterface>(toaster.set(toast.id, toast)));
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
