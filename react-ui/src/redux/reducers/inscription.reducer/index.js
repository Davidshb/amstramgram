import {Inscription} from '../../types'

const defaultState = {
    usernameValid: true,
    usernameValidation: false,
    data: {
        lname: "",
        fname: "",
        pwd: "",
        pwd2: "",
        email: "",
        sexe: "",
        date: "",
        username: ""
    },
    disableButton: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Inscription.TOGGLE_INSCRIPTION_BUTTON :
            let data = state.data
            return {
                ...state,
                disableButton: !(data.lname.length > 2 && data.fname.length > 2 && data.email.length > 0 &&
                                    data.pwd.length + data.pwd2.length >= 16 && data.sexe.length > 0 && state.usernameValid &&
                                    data.pwd === data.pwd2 && (new Date(data.date)).getTime() < Date.now())
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
        case Inscription.CHANGE_INSCRIPTION_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.data
                }
            }
        case Inscription.DELETE_INSCRIPTION_DATA:
            return {
                ...state,
                data: defaultState.data
            }
        default:
            return state
    }
}