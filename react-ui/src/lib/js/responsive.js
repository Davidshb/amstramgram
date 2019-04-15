import moment from 'moment'
moment.updateLocale('fr',require('moment/locale/fr'))

export const TIME_UNTIL_USERNAME_VERIFICATION = 3000

const LETTERS = "[A-Za-z]"

export const REGEXP_NAMES = "^" + LETTERS + "{2,}$"

export const REGEXP_USERNAME = "^@" + LETTERS + "(" + LETTERS + "(_{0,2}|[-.]?)){2,15}$"

export const PASSWORD_MIN_VALUE = "8"
export const PASSWORD_MAX_VALUE = "20"

export const token = () => {return sessionStorage.getItem('Auth')}

export const url = (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '') + '/api'

export const momentJs = moment
