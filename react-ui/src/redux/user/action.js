import { setAuthToken, url } from '../../lib/js'
import { User } from '../types'
import axios from 'axios'

export const getUser = _id => {
  return new Promise((resolve, reject) => {
    axios.get(url + '/user/' + _id)
         .then((res) => {
           resolve(res.data)
         })
         .catch(err => reject(err))
  })
}

export const follow = (id, user_id) => {
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

export const signIn = data => {
  return (dispatch) => {
    axios.post(url + '/connexion', data)
         .then(res => {
           let { token, ...reste } = res.data
           setAuthToken(token)

           dispatch({ type: User.SET_USER, user: reste })
         })
         .catch(err => {
           console.log(err)
           dispatch({ type: User.ERROR, error: err })
           setAuthToken()
         })
  }
}

export function setUser (user) {
  return dispatch => setAuthToken(user['token']) && dispatch({ type: User.SET_USER, user })
}
