import moment from 'moment'

export const capitalizeWords = str => str.replace(/\b\w/g, l => l.toUpperCase())

/**
 * set the token given
 * remove the token if param is not given
 * @param token
 */
export const setAuthToken = (token = null) =>
	token ? sessionStorage.setItem('token', token) : sessionStorage.removeItem('token')

export const dateIsAfterToday = (date, format) =>
	moment(date, format).isAfter(moment(moment.now() - 24 * 60 * 60))

export const checkDateValidity = date => date.length && moment(date, 'DD/MM/YYYY', true).isValid()

export const classNames = param => {
	if (typeof param === String.prototype)
		return param

	return param.join(' ')
}

export const setAutoConnect = (value = null) =>
	value !== null ? localStorage.setItem("auto-connect", value) : localStorage.getItem("auto-connect")
