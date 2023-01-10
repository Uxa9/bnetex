import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { throwError } from 'lib/utils/errorThrower';
import getCssVariable from 'lib/utils/getCssVariable';

export interface CurrentPlatformContext {
    isCurrentPlatformMobile: boolean;
}

const currentPlatformContext = createContext<CurrentPlatformContext | null>(null);

export const useCurrentPlatform = () => useContext(currentPlatformContext) ?? throwError('useCurrentPlatform can be used only inside CurrentPlatformProvider');

const mobileMediaQuery = window.matchMedia(`(max-width: ${getCssVariable('MOBILE_BP')}px)`);

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
