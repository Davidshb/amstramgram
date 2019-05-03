import moment from 'moment'

moment.updateLocale('fr', require('moment/locale/fr'))

export const TIME_UNTIL_USERNAME_VERIFICATION = 3000

const LETTERS = '[A-Za-z]'

export const REGEXP_NAMES = '^' + LETTERS + '{2,}$'

export const REGEXP_USERNAME = '^@' + LETTERS + '(' + LETTERS + '(_{0,2}|[-.]?)){2,15}$'

export const PASSWORD_MIN_VALUE = '8'
export const PASSWORD_MAX_VALUE = '20'

export const token = () => {return sessionStorage.getItem('jwtToken')}

export const url = (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '') + '/api'

export const momentJs = moment

export const NotificationTypes = {
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  INVALID_USERNAME: 'INVALID_USERNAME'
}

export const getNotification = ({ type, message = ' ', options = {} }) => {
  switch (type) {
    case NotificationTypes.ERROR:
      return {
        title: 'Erreur',
        message,
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        dismiss: { duration: 3000 },
        ...options
      }
    case NotificationTypes.MESSAGE:
      return {
        title: 'info',
        animationIn: ['animated', 'jackInTheBox'],
        animatedOut: ['animated', 'bounceOut'],
        dismiss: { duration: 5000 },
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
        dismiss: { duration: 2000 }
      }
    default:
      return null
  }
}
