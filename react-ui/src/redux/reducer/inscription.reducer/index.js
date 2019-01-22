import {Inscription} from '../../actions/types'

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
        date: ""
    },
    disableButton: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case Inscription.TOGGLE_INSCRIPTION_BUTTON :
            let t = state.data
            return {
                ...state,
                disableButton: !(t.lname.length > 2 && t.fname.length > 2 && t.email.length > 0 &&
                                    t.pwd.length + t.pwd2.length >= 16 && t.sexe.length > 0 && state.usernameValid &&
                                    t.pwd === t.pwd2 && (new Date(t.date)).getTime() < Date.now())
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