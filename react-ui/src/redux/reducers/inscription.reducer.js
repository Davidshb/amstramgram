import {Inscription} from '../actions/types'

const defaultState = {
    button: true,
    usernameValid: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Inscription.TOGGLE_INSTRUCTION_BUTTON :
            return {
                ...state,
                button: action.button
            }
        case Inscription.TOGGLE_USERNAME_VALID:
            return {
                ...state,
                usernameValid: action.usernameValid
            }
        default:
            return state
    }
}