import {Common} from '../../types'

const defaultState = {
    modalMode: false,
    inscriptionButton: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Common.TOGGLE_MODAL:
            return {
                ...state,
                modalMode: action.modalMode
            }
        default:
            return state;
    }
};