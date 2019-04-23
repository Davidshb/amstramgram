import { Inscription, User } from '../types'
import { setAuthToken, url } from '../../lib/js'
import axios from 'axios'

export function verifyUsername (param, next = () => {
}) {
  return dispatch => {
    dispatch({ type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: true })
    axios.post(url + '/verifyUsername', { param })
         .then(res => dispatch({ type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: res.data }))
         .then(() => dispatch({ type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: false }))
         .catch(err => {
           dispatch({ type: Inscription.ERROR, error: err.message })
           dispatch({ type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: false })
           dispatch({ type: Inscription.CHANGE_INSCRIPTION_DATA, data: { username: '' } })
         })
         .finally(() => dispatch({ type: Inscription.TOGGLE_INSCRIPTION_BUTTON }))
         .finally(next)
  }
}

export function changeData (dataName, dataValue, next = () => null) {
  return dispatch => {
    dispatch({
      type: Inscription.CHANGE_INSCRIPTION_DATA,
      data: dataValue !== null ? { [dataName]: dataValue } : dataName
    })
    dispatch({ type: Inscription.TOGGLE_INSCRIPTION_BUTTON })
    next()
  }
}

export function deleteData () {
  return (dispatch) => {
    dispatch({ type: Inscription.DELETE_INSCRIPTION_DATA })
    dispatch({ type: Inscription.TOGGLE_INSCRIPTION_BUTTON })
  }
}

export const signUp = (data, next = () => {}) => {
  return dispatch => axios
    .post(url + '/inscription', data)
    .then(res => setAuthToken(res.data.token) && dispatch({ type: User.SET_USER, user: res.data }))
    .then(tmp => console.log(tmp)) //TODO : ne pas oublier d'enlever ce truc
    .catch(err => err.response && dispatch({ type: Inscription.ERROR, error: err.response.data }))
    .finally(next)
}

export const removeError = () => dispatch => dispatch({ type: Inscription.ERROR, error: null })
