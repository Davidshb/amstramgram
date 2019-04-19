import { Inscription } from '../types'
import { checkDateValidity } from '../../lib/js'

const defaultState = {
  usernameValid: true,
  usernameValidation: false,
  data: {
    lname: '',
    fname: '',
    pwd: [
      '',
      ''
    ],
    email: '',
    sexe: '',
    date: '',
    username: ''
  },
  disableButton: true,
  error: '',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Inscription.TOGGLE_INSCRIPTION_BUTTON:
      let data = state.data
      return {
        ...state,
        disableButton: !(data.lname.length > 2 && data.fname.length > 2 && data.email.length > 0 &&
          data.pwd[0].length >= 8 && data.pwd[1].length >= 8 && data.sexe.length &&
          state.usernameValid && data.pwd[0] === data.pwd[1] && checkDateValidity(data.date))
      }
    case Inscription.TOGGLE_USERNAME_VALID:
      return {
        ...state,
        error: '',
        usernameValid: action.usernameValid
      }
    case Inscription.TOGGLE_USERNAME_PROCESSING:
      return {
        ...state,
        error: '',
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
        error: '',
        data: defaultState.data
      }
    case Inscription.ERROR:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
