import { setAuthToken, url } from '../../lib/js'
import { User } from '../types'
import axios from 'axios'

export function getUser (_id) {
  return axios
    .get(`${url}/user/${_id}`)
    .then(res => res.data)
    .catch(err => console.error(err))
}

export function follow (id, user_id) {
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

export function setUser (user, saveBrowser = false) {
  return dispatch => {
    setAuthToken(user['token'])
    dispatch({ type: User.SET_USER, user })

    if (saveBrowser) {
      axios.get(`${url}/trustBrowser`, {
        
      })
    }
  }
}
