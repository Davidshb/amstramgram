import {Common} from '../actions/types'

const defaultState = {
    modalMode: false,
    research: '',
    inscriptionButton: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Common.TOGGLE_MODAL:
            return {
                ...state,
                modalMode: action.modalMode
            }
        case Common.CHANGE_RESEARCH:
            return {
                ...state,
                research: action.research
            }
        default:
            return state;
    }
};