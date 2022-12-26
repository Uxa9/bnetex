import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import variablesMap from 'styles/exportedVariables.module.scss';
import { throwError } from 'lib/utils/errorThrower';

export interface CurrentPlatformContext {
isCurrentPlatformMobile: boolean;
}

const currentPlatformContext = createContext<CurrentPlatformContext | null>(null);

export const useCurrentPlatform = () => useContext(currentPlatformContext) ?? throwError('useCurrentPlatform can be used only inside CurrentPlatformProvider');

const mobileMediaQuery = window.matchMedia(`(max-width: ${variablesMap.mobileBp}px)`);

export function CurrentPlatformProvider({children}: {children: ReactNode}) {

    const [ isCurrentPlatformMobile, setIsCurrentPlatfomMoble ] = useState<boolean>(false);

    const evaluatePlatform = () => setIsCurrentPlatfomMoble(mobileMediaQuery.matches);

    useEffect(() => {
        mobileMediaQuery.addEventListener('change', evaluatePlatform);
        evaluatePlatform();
        return () => mobileMediaQuery.removeEventListener('change', evaluatePlatform);
    }, []);

    return (
        <currentPlatformContext.Provider
            value={{
                isCurrentPlatformMobile,
            }}
        >
            {children}
        </currentPlatformContext.Provider>
    );

}
