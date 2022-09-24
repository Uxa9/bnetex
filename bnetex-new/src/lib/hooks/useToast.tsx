import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const toastContext = createContext<ToastContext | null>(null);

export interface ToastContext {
    toast: Toast | null,
    bakeToast(toast: Toast | null): void
}

export interface Toast {
    type: 'error' | 'success';
    text: string;
}

export const useToast = () => useContext(toastContext) ?? throwError('useToast can be used only inside ToastProvider');

export function ToastProvider({children}: {children: ReactNode}) {
    const [ toast, setToast ] = useState<Toast | null>(null);

    const bakeToast = (toast: Toast | null) => setToast(toast);

    const memorized = useMemo(() => ({
        toast,
        bakeToast,
    }), [ toast ]);

    return (
        <toastContext.Provider
            value={memorized}
        >
            {children}
        </toastContext.Provider>
    );
}
