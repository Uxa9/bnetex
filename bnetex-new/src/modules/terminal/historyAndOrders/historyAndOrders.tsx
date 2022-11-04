import { useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './historyAndOrders.module.scss';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import OpenedPositions from './sections/openedPositions/openedPositions';
import OpenedOrders from './sections/openedOrders/openedOrders';
import OrderHistory from './sections/orderHistory/orderHistory';

type SectionType = 'openedPositions' | 'openedOrders' | 'tradeHistory';

interface HistoryAndOrdersSection {
    section: SectionType,
    title: string
}

const historyAndOrdersSections: HistoryAndOrdersSection[] = [
    {
        section: 'openedPositions',
        title: 'Позиции',
    },
    {
        section: 'openedOrders',
        title: 'Открытые ордера',
    },
    {
        section: 'tradeHistory',
        title: 'История сделок',
    },
];

const HistoryAndOrders = ({className}: {className: string}) => {

    const [activeSection, setActiveSection] = useState<SectionType>('openedPositions');

    const sectionComponent = useMemo(() => {
        switch(activeSection) {
            case 'openedPositions': {
                return <OpenedPositions />;
            }
            case 'openedOrders': {
                return <OpenedOrders />;
            }
            default: {
                return <OrderHistory />;
            }
        }
    }, [ activeSection ]);

    return (
        <div className={classNames(
            styles['history-and-orders'],
            className,
            'scroll'
        )}
        >
            <div className={styles['toggle-section-group']}>
                <ToggleButtonGroup
                    name={'terminalDataSection'}
                    onChange={setActiveSection}
                    value={activeSection}
                    buttonStyle={'underlined'}
                    buttonClassname={classNames(
                        styles['toggle-section-button'],
                        'text',
                    )}
                >
                    {
                        historyAndOrdersSections.map((section: HistoryAndOrdersSection) => 
                            <ToggleButton 
                                text={section.title}
                                value={section.section}
                            />
                        )
                    }
                </ToggleButtonGroup>
            </div>
            { sectionComponent }
        </div>
    );
};

export default HistoryAndOrders;
