import { createDummyArray } from 'lib/utils/createDummyArray';
import useDynamicGridAnimation from 'modules/Landing/hooks/useDynamicGridAnimation';
import { ColumnAnimationProperties } from 'modules/Landing/types/dynamicGrid';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './dynamicGrid.module.scss';

interface DynamicColumnProps {
    dotQuantity: number;
    columnQuantity: number;
    columnIndex: number;
    waveScale?: number;
    waveLenght?: number;
    waveIteration?: number;
}

const DEFAULT_WAVE_ITERATION = 2000;
const DEFAULT_WAVE_LENGHT = 5;

const DynamicColumn = ({
    dotQuantity,
    columnQuantity,
    columnIndex,
    waveScale = 1.1,
    waveLenght = DEFAULT_WAVE_LENGHT,
    waveIteration = DEFAULT_WAVE_ITERATION,
}: DynamicColumnProps) => {

    const columnRef = useRef<HTMLDivElement | null>(null);
    const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationDelayRef = useRef<NodeJS.Timeout | null>(null);

    const animationProperties: ColumnAnimationProperties = useMemo(() => {
        const columnAnimationTime = waveIteration / waveLenght;
        return {
            waveIteration: waveIteration,
            totalAnimationTime: columnAnimationTime * columnQuantity,
            columnIterationDelay: columnAnimationTime * columnIndex,
        };
    }, [ waveLenght, waveIteration, columnQuantity, columnIndex ]);

    const { columnAnimation, dotAnimation } = useDynamicGridAnimation(waveScale);

    useEffect(() => {
        const { waveIteration, totalAnimationTime, columnIterationDelay } = animationProperties;

        killTimeouts();

        animationIntervalRef.current = setInterval(() => {
            animateColumn(columnIterationDelay, waveIteration);
        }, totalAnimationTime);
        animateColumn(columnIterationDelay, waveIteration);

        return () => {
            killTimeouts();
        };
    }, [ animationProperties, columnAnimation, dotAnimation ]);

    const killTimeouts = () => {
        animationIntervalRef.current &&
            clearInterval(animationIntervalRef.current);
        animationDelayRef.current &&
            clearInterval(animationDelayRef.current);
    };

    const animateColumn = useCallback((animationDelay: number, waveIteration: number) => {
        animationDelayRef.current = setTimeout(() => {
            columnRef.current
                ?.animate(columnAnimation, waveIteration);
            columnRef.current
                ?.querySelectorAll('div')
                .forEach(dot => {
                    dot.animate(dotAnimation, waveIteration);
                });
        }, animationDelay);
    }, [ columnAnimation, dotAnimation ]);

    return (
        <div
            className={styles['column']}
            key={columnIndex}
            ref={columnRef}
        >
            {
                createDummyArray(dotQuantity).map((_it, index) =>
                    <div
                        className={styles['dot']}
                        key={index}
                    />
                )
            }
        </div>
    );
};

export default DynamicColumn;
