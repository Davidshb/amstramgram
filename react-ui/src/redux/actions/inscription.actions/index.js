import {Inscription} from '../../types'
import {url} from "../../../lib/js";
import axios from 'axios'

export function verifyUsername(param, next = () => {}) {
	return async (dispatch) => {
		await dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: true})
		axios.post(url + '/verifyUsername', {param}).then((res) => {
			dispatch({type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: res.data})
		})
			.then(() => dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: false}))
			.then(() => next())
	}
}

export function signUp(user_data, next = () => {}) {
	return async (dispatch) => {
		axios.post(url + '/inscription', user_data).then(async (res, err) => {
			console.log(res)
			if (err) {
				console.log(err)
				throw err
			}
			console.log(res.data)
			let user = res.data
			sessionStorage.setItem('Auth', JSON.stringify(user))
			await dispatch({type: Inscription.SET_USER, user})
			next()
		})
	}
}

export function changeData(dataName, dataValue, next = () => {}) {
	return async (dispatch) => {
		let t = {
			type: Inscription.CHANGE_INSCRIPTION_DATA,
			data: {}
		}

		t.data[dataName] = dataValue

		await dispatch(t)
		await dispatch({type: Inscription.TOGGLE_INSCRIPTION_BUTTON})
		next()
	}
}

export function deleteData(next = () => {}) {
	return async (dispatch) => {
		await dispatch({type: Inscription.DELETE_INSCRIPTION_DATA})
		next()
	}
}