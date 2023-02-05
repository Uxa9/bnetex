import { useEffect, useMemo, useState } from 'react';
import { DynamicGridAnimation } from '../types/dynamicGrid';
import { evaluateTheme } from 'lib/utils/evaluateAppColors';
import { useTheme } from 'lib/hooks/useTheme';

const useDynamicGridAnimation = (columnScaleCoefficient: number): DynamicGridAnimation => {

    const { theme } = useTheme();
    const [dotAnimation, setDotAnimation] = useState<Keyframe[]>([]);

    const columnAnimation: Keyframe[] = useMemo(() => {
        return [
            { transform: 'translateY(0) scale(1)' },
            { transform: `translateY(0) scale(${columnScaleCoefficient})` },
            { transform: 'translateY(0) scale(1)' },
        ];
    }, [ columnScaleCoefficient ]);

    useEffect(() => {
        const colors = evaluateTheme();
        setDotAnimation([
            { backgroundColor: colors.grayscale[3] },
            { backgroundColor: colors.accent.accent[3] },
            { backgroundColor: colors.grayscale[3] },
        ]);
    }, [ theme ]);

    return {
        columnAnimation,
        dotAnimation,
    };
};

export default useDynamicGridAnimation;
