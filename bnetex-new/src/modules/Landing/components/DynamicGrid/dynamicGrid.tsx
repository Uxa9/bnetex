import { createDummyArray } from 'lib/utils/createDummyArray';
import getCssVariable from 'lib/utils/getCssVariable';
import { useEffect, useState } from 'react';
import DynamicColumn from './dynamicColumn';
import styles from './dynamicGrid.module.scss';

const DynamicGrid = () => {

    const headerHeight = getCssVariable('HEADER_HEIGHT');
    const laptopBp = getCssVariable('LAPTOP_BP');
    const mobileBp = getCssVariable('MOBILE_BP');

    const [columnQuantity, setColumnQuantity] = useState<number>(0);
    const [dotQuantity, setDotQuantity] = useState<number>(0);
    const [waveLength, setWaveLength] = useState<number>(getWaveProperties()[1]);

    useEffect(() => {
        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    const onWindowResize = () => {
        const [ dotContainerSize, _waveLenght ] = getWaveProperties();

        const maxColumns = Math.floor(window.innerWidth / dotContainerSize);
        const maxDots = Math.floor((window.innerHeight - headerHeight) / dotContainerSize);

        setWaveLength(_waveLenght);
        setColumnQuantity(maxColumns);
        setDotQuantity(maxDots);
    };

    function getWaveProperties() {
        switch (true) {
            case window.innerWidth <= mobileBp: {
                return [30, 7];
            }
            case window.innerWidth <= laptopBp: {
                return [40, 9];
            }
            default: {
                return [76, 11];
            }
        }
    };

    return (
        <div className={styles['container']}>
            {
                createDummyArray(columnQuantity).map((_it, index) =>
                    <DynamicColumn
                        dotQuantity={dotQuantity}
                        columnQuantity={columnQuantity}
                        columnIndex={index}
                        waveScale={1.07}
                        waveLenght={waveLength}
                    />
                )
            }
        </div>
    );
};

export default DynamicGrid;
