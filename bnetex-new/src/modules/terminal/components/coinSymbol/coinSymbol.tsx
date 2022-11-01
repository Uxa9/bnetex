import classNames from 'classnames';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import styles from './coinSymbol.module.scss';

const CoinSymbol = ({firstCoin, secondCoin, lever, type}: CoinSymbolProps) => {
    return(
        <div 
            className={styles['coin-symbol']}
        >
            <div 
                className={classNames(
                    styles['coin-symbol__main'],
                    'text',
                )}
            >
                <p>
                    {`${firstCoin}/${secondCoin}`}
                </p>
                <p
                    className={styles['coin-symbol__lever']}
                >
                    {`x${lever}`}
                </p>
            </div>
            <span className={classNames(
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
