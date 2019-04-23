import { Inscription } from '../types'
import { checkDateValidity } from '../../lib/js'
import isEmail from 'validator/lib/isEmail'

const defaultState = {
  usernameValid: false,
  usernameValidation: false,
  data: {
    lname: 'David',
    fname: 'Sehoubo',
    pwd: [
      '12345678',
      '12345678'
    ],
    email: 't@h.fr',
    sexe: 'homme',
    date: '27/10/2000',
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
        disableButton: !(data.lname.length > 2 && data.fname.length > 2 && isEmail(data.email) > 0 &&
          data.pwd[0].length >= 8 && data.pwd[1].length >= 8 && data.sexe.length !== 0 && !state.usernameValidation &&
          state.usernameValid && data.username !== '' && data.pwd[0] === data.pwd[1] && checkDateValidity(data.date))
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
      if (state.data.username !== null) state.usernameValid = false
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
