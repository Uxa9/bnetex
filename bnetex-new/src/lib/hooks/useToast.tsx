import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const toastContext = createContext<ToastContext | null>(null);

export interface ToastContext {
    toast: Toast | null;
    bakeToast: BakeToastObject;
    clearToast(): void;
}

interface BakeToastObject {
    error: (message: string) => void;
    success: (message: string) => void;
}

export interface Toast {
    type: 'error' | 'success';
    text: string;
}

export const useToast = () => useContext(toastContext) ?? throwError('useToast can be used only inside ToastProvider');

export function ToastProvider({children}: {children: ReactNode}) {
    const [ toast, setToast ] = useState<Toast | null>(null);

    const bakeToast = {
        error: (message: string) => setToast({type: 'error', text: message}),
        success: (message: string) => setToast({type: 'success', text: message}),
    };

    const clearToast = () => setToast(null);

    const memorized = useMemo(() => ({
        toast,
        bakeToast,
        clearToast,
    }), [ toast ]);

    return (
        <toastContext.Provider
            value={memorized}
        >
            {children}
        </toastContext.Provider>
    );
}
