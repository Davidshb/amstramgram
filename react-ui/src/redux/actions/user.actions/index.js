import axios from 'axios'
import {User} from '../../types'
import {url, token, setAuthToken} from '../../../lib/js'

export const getUser = (_id) => {
	return new Promise((resolve, reject) => {
		axios.get(url + '/user/' + _id)
			.then((res) => {
				resolve(res.data)
			})
			.catch(err => reject(err))
	})
}

export const getUserProfile = (_id) => {
	return (dispatch) => {
		axios.get(url + '/profile/' + _id)
			.then((res) => {
				let profile = res.data
				dispatch({type: User.SET_PROFILE, profile})
			})
			.catch(err => console.log(err))
	}
}

export const follow = (id, user_id) => {
	return (dispatch) => {
		axios.post(url + '/user/follow', {id, user_id}).then((res, err) => {
			if (err)
				throw err
			else
				dispatch({type: User.FOLLOW_USER, user_id})
		})
			.catch((err) => console.log(err))
	}
}

let sign = (action) => {
	return (user_data) => {
		return (dispatch) => {
			axios.post(url + action, user_data).then((res, err) => {
				console.log(res)
				if (err) {
					console.log(err)
					throw err
				}

				let {user, token} = res.data
				setAuthToken(token)
				dispatch({type: User.SET_USER, user})
				dispatch({type: User.SET_PROFILE, profile: res.data.profile})
				dispatch({type: User.AUTH, isAuth: true})
			})
		}
	}
}

export const signIn = sign('/connexion')

export const signUp = sign('/inscription')