import {bindActionCreators} from 'redux';
import { store } from 'store';
import ActionCreators from '../../store/action-creators/';

export const useActions = () => {
    return bindActionCreators(ActionCreators, store.dispatch);
};
