import axios from 'axios'
import {momentJs} from "./responsive";

export const capitalizeWords = str => {
	return str.replace(/\b\w/g, l => l.toUpperCase())
}

export const setAuthToken = token => {
	if (token) {
		sessionStorage.setItem('jwtToken', token)
		axios.defaults.headers.common['Authorization'] = token
	} else
		delete axios.defaults.headers.common['Authorization']
}

export const verifyIsAfterToday = (date,format) => {
	return momentJs(date, format).isAfter(momentJs(momentJs.now()-24*60*60))
}

/*export const todayDateString = () => {
	return new Date().getFullYear()
		+ "-" + ("0" + (new Date().getMonth() + 1)).slice(-2)
		+ "-" + ("0" + new Date().getDate()).slice(-2)
}*/