import { Inscription, User } from '../types'
import { setAuthToken, url } from '../../lib/js'
import axios from 'axios'

export function verifyUsername (param, next = () => {
}) {
  return async (dispatch) => {
    await dispatch({ type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: true })
    axios.post(url + '/verifyUsername', { param }).then((res) => {
      dispatch({ type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: res.data })
    })
         .then(() => dispatch({ type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: false }))
         .catch(err => {
           dispatch({ type: Inscription.ERROR, error: err.message })
           dispatch({ type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: false })
           dispatch({ type: Inscription.CHANGE_INSCRIPTION_DATA, data: { username: '' } })
         })
         .then(() => next() && dispatch({ type: Inscription.TOGGLE_INSCRIPTION_BUTTON }))
  }
}

export function changeData (dataName, dataValue, next = () => {
}) {
  return dispatch => {
    dispatch({
      type: Inscription.CHANGE_INSCRIPTION_DATA,
      data: { [dataName]: dataValue }
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
  return dispatch =>
    axios.post(url + '/inscription', data)
         .then(res => {
           setAuthToken(res.data.token)
           dispatch({ type: User.SET_USER, user: res.data })
         })
         .catch(err => {
           console.log(err)
           if (err.response) dispatch({ type: Inscription.ERROR, error: err.response.data })
         })
         .then(next)
}
