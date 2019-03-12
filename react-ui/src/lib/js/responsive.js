import moment from 'moment'
moment.updateLocale('fr',require('moment/locale/fr'))

export const TIME_UNTIL_USERNAME_VERIFICATION = 3000

export const REGEXP_NAMES = "^[A-Za-z]{2,}$"
// eslint-disable-next-line
export const REGEXP_USERNAME = "^@\w(\w(_{0,2}|[-.]?)){2,15}$/"

export const PASSWORD_MIN_VALUE = "8"
export const PASSWORD_MAX_VALUE = "20"

export const token = sessionStorage.getItem('Auth')

export const url = process.env.url

export const momentJs = moment