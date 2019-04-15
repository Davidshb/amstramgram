import axios from 'axios'
import {momentJs} from "./responsive";

export const capitalizeWords = str => {
	return str.replace(/\b\w/g, l => l.toUpperCase())
}

export const setAuthToken = (token = null) => {
	if (token) {
		localStorage.setItem('jwtToken', token)
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	} else {
		delete axios.defaults.headers.common['Authorization']
		localStorage.removeItem('jwtToken')
	}
}

export const dateIsAfterToday = (date, format) => {
	return momentJs(date, format).isAfter(momentJs(momentJs.now()-24*60*60))
}

export const checkDateValidity  = date => {
	let res = momentJs(date, "DD/MM/YYYY", true)
	return date.length && res.isValid();
}