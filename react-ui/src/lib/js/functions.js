import moment from 'moment'

export const capitalizeWords = str => {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

export const setAuthToken = (token = null) => {
  if (token)
    sessionStorage.setItem('token', token)
  else
    sessionStorage.removeItem('token')
}

export const dateIsAfterToday = (date, format) => {
  return moment(date, format).isAfter(moment(moment.now() - 24 * 60 * 60))
}

export const checkDateValidity = date => {
  let res = moment(date, 'DD/MM/YYYY', true)
  return date.length && res.isValid()
}
