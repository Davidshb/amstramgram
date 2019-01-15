import {Inscription} from '../actions/types'

const defaultState = {
    button: true,
    usernameValid: true,
    inscriptionData: {},
    usernameValidation: false
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
        case Inscription.TOGGLE_USERNAME_PROCESSING:
            return {
                ...state,
                usernameValidation: action.usernameValidation
            }
        default:
            return state
    }
}