import { setup } from 'axios-cache-adapter'

export const TIME_UNTIL_USERNAME_VERIFICATION = 3000

const LETTERS = '[A-Za-z]'

export const REGEXP_NAMES = '^' + LETTERS + '{2,}$'

export const REGEXP_USERNAME = '^@' + LETTERS + '(' + LETTERS + '(_{0,2}|[-.]?)){2,15}$'

export const PASSWORD_MIN_VALUE = '8'
export const PASSWORD_MAX_VALUE = '20'

export const token = () => sessionStorage.getItem('token')

export const device = (idOnly = false) => {
	const res = JSON.parse(localStorage.getItem('device'))
	if (!res)
		return null
	if (idOnly)
		return res.id
	return res
}

export const url = (process.env['NODE_ENV'] === 'development' ? 'http://localhost:5000' : '') + '/api'

export const NotificationTypes = {
	ERROR: 'ERROR',
	MESSAGE: 'MESSAGE',
	INVALID_USERNAME: 'INVALID_USERNAME',
	UNKNOWN_ID: 'UNKNOWN_ID',
	INVALID_PASSWORD: 'INVALID_PASSWORD',
	INSCRIPTION_SUCCEED: 'INSCRIPTION_SUCCEED',
	EMAIL_VERIFICATION_SUCCEED: 'EMAIL_VERIFICATION_SUCCEED',
	EMAIL_VERIFICATION_FAILED: 'EMAIL_VERIFICATION_FAILED',
	NEW_EMAIL_SAVE_SUCCEED: 'NEW_EMAIL_SAVE_SUCCEED',
	NEW_EMAIL_SAVE_FAILED: 'NEW_EMAIL_SAVE_FAILED'
}

export const getNotification = ({type, message = ' ', options = {}}) => {
	switch (type) {
		case NotificationTypes.ERROR:
			return {
				title: 'Erreur',
				type: 'danger',
				insert: 'top',
				container: 'top-right',
				dismiss: {duration: 3000},
				message,
				...options
			}
		case NotificationTypes.MESSAGE:
			return {
				type: 'info',
				animationIn: ['animated', 'jackInTheBox'],
				animatedOut: ['animated', 'bounceOut'],
				dismiss: {duration: 5000},
				message,
				...options
			}
		case NotificationTypes.INVALID_USERNAME:
			return {
				type: 'warning',
				title: 'Username',
				message: 'Ce nom d\'utilisateur est déjà utilisé',
				animationIn: ['animated', 'fadeIn'],
				animationOut: ['animated', 'fadeOut'],
				insert: 'top',
				container: 'top-center',
				dismiss: {duration: 2000}
			}
		case NotificationTypes.UNKNOWN_ID:
			return {
				type: 'warning',
				container: 'top-center',
				insert: 'top',
				dismiss: {duration: 2000},
				message,
				...options
			}
		case NotificationTypes.INVALID_PASSWORD:
			return {
				type: 'warning',
				container: 'top-center',
				insert: 'top',
				dismiss: {duration: 2000},
				message: 'Mot de passe incorrecte',
				...options
			}
		case NotificationTypes.INSCRIPTION_SUCCEED:
			return {
				type: 'success',
				container: 'top-center',
				insert: 'top',
				dismiss: {duration: 3000},
				message: 'Inscription réussi !',
				...options
			}
		case NotificationTypes.EMAIL_VERIFICATION_SUCCEED:
			return {
				type: 'success',
				container: 'top-right',
				insert: 'top',
				dismiss: {duration: 2000},
				message: 'Email vérifié vous pouvez vous connecter'
			}
		case NotificationTypes.EMAIL_VERIFICATION_FAILED:
			return {
				type: 'error',
				container: 'top-right',
				insert: 'top',
				message: 'Utilisateur introuvable lors de la validation d\'email',
				dismiss: {duration: 3000}
			}
		case NotificationTypes.NEW_EMAIL_SAVE_FAILED:
			return {
				type: 'error',
				container: 'top-right',
				insert: 'top',
				message: "Vérifier l'email fourni et réessayer"
			}
		case NotificationTypes.NEW_EMAIL_SAVE_SUCCEED:
			return {
				type: 'success',
				container: 'top-right',
				insert: 'top',
				message: 'l\'email a été modifié. Pensez à le vérifier 😌',
				dismiss: {duration: 3000}
			}
		default:
			return null
	}
}

export const api = setup({
	baseURL: '/',
	cache: {
		maxAge: 1000 * 60 * 10, // cache de 10 minute
		exclude: {query: false}
	}
})
