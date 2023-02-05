import { createDummyArray } from 'lib/utils/createDummyArray';
import getCssVariable from 'lib/utils/getCssVariable';
import { useEffect, useState } from 'react';
import DynamicColumn from './dynamicColumn';
import styles from './dynamicGrid.module.scss';

const MIN_COLUMN_WIDTH = 76;
const MIN_DOT_SIZE = 76;

const DynamicGrid = () => {

    const headerHeight = getCssVariable('HEADER_HEIGHT');

    const [columnQuantity, setColumnQuantity] = useState<number>(0);
    const [dotQuantity, setDotQuantity] = useState<number>(0);

    useEffect(() => {
        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    const onWindowResize = () => {
        const maxColumns = Math.floor(window.innerWidth / MIN_COLUMN_WIDTH);
        const maxDots = Math.floor((window.innerHeight - headerHeight) / MIN_DOT_SIZE);

        setColumnQuantity(maxColumns);
        setDotQuantity(maxDots);
    };

    return (
        <div className={styles['container']}>
            {
                createDummyArray(columnQuantity).map((_it, index) =>
                    <DynamicColumn
                        dotQuantity={dotQuantity}
                        columnQuantity={columnQuantity}
                        columnIndex={index}
                        waveScale={1.1}
                        waveLenght={11}
                        columnAnimationTime={220}
                    />
                )
            }
        </div>
    );
};

export default DynamicGrid;
