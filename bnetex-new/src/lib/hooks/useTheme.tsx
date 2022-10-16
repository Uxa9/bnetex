import classNames from 'classnames';
import { throwError } from 'lib/utils/errorThrower';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface ThemeContext {
    theme: ThemeType;
    toggleTheme(): void;
}

type ThemeType = 'dark' | 'light';

const themeContext = createContext<ThemeContext | null>(null);

export const useTheme = () => 
    useContext(themeContext) ?? throwError('useTheme может использоваться только внутри ThemeProvider');

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [ theme, setTheme ] = useState<ThemeType>('dark');

    const toggleTheme = () => setTheme((prevState) => prevState === 'dark' ? 'light' : 'dark');

    useEffect(() => setTheme(getTheme()), []);

    useEffect(
        () => {
            localStorage.setItem('theme', theme);
        },
        [ theme ],
    );

    const getTheme = () => {
        const userMedia = window.matchMedia('(prefers-color-scheme: light)');
        const localTheme = localStorage.getItem('theme') as ThemeType;
        return localTheme ? localTheme : userMedia.matches ? 'light' : 'dark';
    };

    return <themeContext.Provider
        value={{ theme, toggleTheme }}
    >
        <div 
            className={classNames(
                'theme-wrapper',
                theme === 'dark' ? 'dark-theme' : 'light-theme'
            )}
        >
            {children}
        </div>
    </themeContext.Provider>;
}
