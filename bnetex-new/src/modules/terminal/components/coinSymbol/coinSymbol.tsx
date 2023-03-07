import clsx from 'clsx';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import styles from './coinSymbol.module.scss';

const CoinSymbol = ({pair, lever, type, callbackFunc}: CoinSymbolProps) => {    
    return(
        <div 
            className={styles['coin-symbol']}
            onClick={() => callbackFunc(pair)}
        >
            <div 
                className={clsx(
                    styles['coin-symbol__main'],
                    'text',
                )}
            >
                <p>
                    {`${pair}`}
                </p>
                <p
                    className={styles['coin-symbol__lever']}
                >
                    {`x${lever}`}
                </p>
            </div>
            <span className={clsx(
                styles['coin-symbol__type'],
                'caption-mini'  
            )}
            >
                { type }
            </span>
        </div>
    );
};

export default CoinSymbol;
