import { api, setAuthToken, url } from '../../lib/js'
import { User } from '../types'
import axios from 'axios'

export function getUser(_id) {
  return api
    .get(`${url}/user/${_id}`)
    .then(res => res.data)
    .catch(err => console.error(err))
}

export function follow(id, user_id) {
  return dispatch =>
    axios.post(url + '/user/follow', { id, user_id })
         .then((res, err) => {
           if (err)
             throw err
           else
             dispatch({ type: User.FOLLOW_USER, user_id })
         })
         .catch(err => console.log(err))
}

export function setUser({ token, ...data }) {
  return dispatch => {
    axios.defaults.headers['common']['Authorization'] = `Bearer ${token}`
    setAuthToken(token)
    dispatch({ type: User.SET_USER, user: data })
  }
}

export function removeUser() {
  return dispatch => {
    dispatch({ type: User.SET_USER, user: null })
  }
}

export function changeData(dataName, dataValue) {
  return dispatch => dispatch({type: User.CHANGE_DATA, [dataName]: dataValue})
}
