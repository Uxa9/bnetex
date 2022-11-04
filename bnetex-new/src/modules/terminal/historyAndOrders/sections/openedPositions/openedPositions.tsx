import classNames from 'classnames';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import CoinSymbol from 'modules/terminal/components/coinSymbol/coinSymbol';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import { Margin } from 'modules/terminal/types/margin';
import { mockedOpenePositions } from './mock';
import styles from './openedPositions.module.scss';

export interface OpenedPosition {
    coinSymbol: CoinSymbolProps;
    amount: number;
    entryPrice: number;
    markedPrice: number;
    liquidationPrice: number;
    margin: Margin;
    PNL: number; // считается по текущей цене...
}

// toDo сделать максимально просто....

const OpenedPositions = () => {

    const evaluateMarginType = (type: string) => {
        return type === 'cross' ? 'кросс' : 'изолир.';
    };

    return(
        <table className={styles['opened-positions']}>
            <thead>
                <tr className={'caption'}>
                    <th>Символ</th>
                    <th>Размер</th>
                    <th className={styles['desktop-price-label']}>Цена входа</th>
                    <th className={styles['desktop-price-label']}>Цена маркировки</th>
                    <th className={styles['desktop-price-label']}>Цена ликвидации</th>
                    <th className={styles['mobile-price-label']}>
                        Цена входа / маркировки / ликвидации                       
                    </th>
                    <th>Маржа</th>
                    <th>PNL</th>
                </tr>
            </thead>
            <tbody>
                {
                    // mockedOpenePositions.map((position: OpenedPosition, index: number) => 
                    //     <tr 
                    //         className={'text'}
                    //         key={index}
                    //     >
                    //         <td className={styles['coin-symbol']}>
                    //             <span 
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >
                    //                 Символ
                    //             </span>
                    //             <CoinSymbol 
                    //                 {...position.coinSymbol}
                    //             />
                    //         </td>
                    //         <td className={styles['amount']}>
                    //             <span 
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >Размер
                    //             </span>
                    //             <SignedNumber 
                    //                 value={position.amount}
                    //             />
                    //         </td>
                    //         <td className={styles['entry-price']}> 
                    //             <span className={classNames(
                    //                 styles['body-label'],
                    //                 'caption',
                    //             )}
                    //             >
                    //                 Цена входа
                    //             </span>
                    //             {position.entryPrice} 
                    //         </td>
                    //         <td className={styles['marked-price']}>
                    //             <span
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >
                    //                 Цена маркировки
                    //             </span>
                    //             {position.markedPrice} 
                    //         </td>
                    //         <td className={styles['liquidation-price']}> 
                    //             {position.liquidationPrice} 
                    //         </td>
                    //         <td className={styles['joined-price']}>
                    //             <span
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >
                    //                 Цена входа / маркировки / ликвидации
                    //             </span>
                    //             {`${position.entryPrice} /
                    //             ${position.markedPrice} /
                    //             ${position.liquidationPrice}`}
                    //         </td>
                    //         <td className={styles['margin-cell']}>
                    //             <span 
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >
                    //                 Маржа
                    //             </span>
                    //             <div className={styles['margin']}>
                    //                 <span>{position.margin.value}</span>
                    //                 <span>({evaluateMarginType(position.margin.type)})</span>
                    //             </div>
                    //         </td>
                    //         <td className={styles['PNL']}> 
                    //             <span 
                    //                 className={classNames(
                    //                     styles['body-label'],
                    //                     'caption',
                    //                 )}
                    //             >
                    //                 PNL
                    //             </span>
                    //             <SignedNumber 
                    //                 value={position.PNL}
                    //             />
                    //         </td>
                    //     </tr>
                    // )
                }
            </tbody>
        </table>
    );
};

export default OpenedPositions;
