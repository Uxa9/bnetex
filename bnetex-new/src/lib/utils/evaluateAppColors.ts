import colorsMapModule from 'styles/colors/mapModule.module.scss';
import { THEME_ROOT_ID } from 'lib/hooks/useTheme';
import { IndexableStringType } from 'lib/types/indexableStringType';
import { throwError } from './errorThrower';

type AccentColor = {
    '1': string,
    '2': string,
    '3': string,
    '4': string,
    '5': string,
    '6': string,
}

export type Theme = {
    grayscale: {
        '1': string,
        '2': string,
        '3': string,
        '4': string,
        '5': string,
        '6': string,
        '7': string,
        '8': string,
        '9': string,
        '10': string,
        '11': string,
        '12': string,
        'input': string,
        'card': string,
    },
    accent: {
        accent: AccentColor,
        blue: AccentColor,
        green: AccentColor,
        orange: AccentColor,
        red: AccentColor,
    },
}

function evaluateStyles() {
    const themeElement = document.getElementById(THEME_ROOT_ID)
        ?? throwError(`Can not find element with id ${THEME_ROOT_ID}`);
    return getComputedStyle(themeElement);
}

function extractVariableName(cssVariable: string) {
    const CSS_VARIABLE_REGEX = /--(\w+-?)+/;
    return CSS_VARIABLE_REGEX.exec(cssVariable)?.[0] ?? '';
}

export function evaluateTheme(): Theme {
    const styles = evaluateStyles();

    function getColor(variable: string) {
        return styles.getPropertyValue(extractVariableName(variable)).trim();
    }

    function populateColorsObject (colorsQuantity: number, colorGroup: string) {
    
        const colors: IndexableStringType = {};
        
        for (let i = 1; i <= colorsQuantity; i++) {
            colors[`${i}`] = getColor(colorsMapModule[`${colorGroup}-${i}`]);
        }
    
        return colors;
    }

    return {
        // @ts-ignore
        grayscale: {
            ...populateColorsObject(12, 'grayscale'),
            'input': getColor(colorsMapModule['grayscale-input']),
            'card': getColor(colorsMapModule['grayscale-card']),
        },
        accent: {
            // @ts-ignore
            accent: {
                ...populateColorsObject(6, 'accent'),
            },
            // @ts-ignore
            blue: {
                ...populateColorsObject(6, 'blue'),
            },
            // @ts-ignore
            orange: {
                ...populateColorsObject(6, 'orange'),
            },
            // @ts-ignore
            red: {
                ...populateColorsObject(6, 'red'),
            },
            // @ts-ignore
            green: {
                ...populateColorsObject(6, 'green'),
            },
        },
    };
}
