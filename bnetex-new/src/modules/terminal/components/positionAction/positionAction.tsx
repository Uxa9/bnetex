import { PositionActionType } from 'modules/terminal/types/positionAction';
import styles from './positionAction.module.scss';

const PositionAction = ({action}: {action: PositionActionType}) => {
    return action === 'purchase' ?
        <span className={styles['action--purchase']}>Покупка</span> : 
        <span className={styles['action--sale']}>Продажа</span>;
};

export default PositionAction;
