import {TraderAction, TraderState} from "../actions/trader";


const initialState = {
    messages: [] as Object[]
};

export const traderReducer = (state = initialState, action: TraderAction): TraderState => {
    switch (action.type) {
        default:
            return state.messages;
    }
}