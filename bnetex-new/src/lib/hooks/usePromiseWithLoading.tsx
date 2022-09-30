import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const promiseWithLoadingContext = createContext<PromiseWithLoadingParams | null>(null);

export interface PromiseWithLoadingParams {
    isLoading: boolean;
    promiseWithLoading(action: Promise<any>): Promise<any>;
}

export const usePromiseWithLoading = () => useContext(promiseWithLoadingContext)
 ?? throwError('usePromiseWithLoading can be used only inside PromiseWithLoadingProvider');

export function PromiseWithLoadingProvider({children}: {children: ReactNode}) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const promiseWithLoading = (action: Promise<any>) => {
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
