import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useState } from 'react';

const promiseWithLoadingContext = createContext<PromiseWithLoadingParams | null>(null);

export interface PromiseWithLoadingParams {
    isLoading: boolean;
    promiseWithLoading<T>(action: Promise<T>): Promise<T>;
}

export const usePromiseWithLoading = () => useContext(promiseWithLoadingContext)
 ?? throwError('usePromiseWithLoading can be used only inside PromiseWithLoadingProvider');

export function PromiseWithLoadingProvider({children}: {children: ReactNode}) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    function promiseWithLoading<T> (action: Promise<T>) {
        setIsLoading(true);
        return action.finally(() => setIsLoading(false));
    };
    return (
        <promiseWithLoadingContext.Provider
            value={{isLoading, promiseWithLoading}}
        >
            {children}
        </promiseWithLoadingContext.Provider>
    );
}
