import React from 'react'
import { connect } from 'react-redux'
import { setUser } from '../redux/actions'
import { InputPasswords } from '../Modules/'
import { Lock } from '@material-ui/icons'
import { notificationContext } from '../Provider/NotificationProvider'
import axios from 'axios'
import { device, NotificationTypes, url } from '../lib/js'
import './style.scss'

class Connexion extends React.Component {
  toggleNumber = false
  #password
  fromInscription = false
  static contextType = notificationContext

  constructor(props, context) {
    super(props, context)
    let id = '',
      data = JSON.parse(sessionStorage.getItem('connexion-data'))

    const p = new URLSearchParams(window.location.href).get('p')

    if (window.history.state && window.history.state.state && window.history.state.state.username) {
      id = window.history.state.state.username
      this.fromInscription = true
      if (data)
        data.id = id
    }
    window.history.replaceState(null, null, window.location.pathname)

    const state = {
      disableButton: true,
      id,
      password: '',
      placeholder: 'username',
      inputType: 'text',
      connexionLoading: false,
      cb: false
    }

    this.state = data ? { ...state, ...data } : state

    if (p) {
      this.fromEmailVerification = p
      if (p !== '1' !== '0')
        this.state.id = p
    }

    this.loading = false

    this.changeData = this.changeData.bind(this)
    this.login = this.login.bind(this)
    this.errorHandler = this.errorHandler.bind(this)
  }

  changeData(dataName, dataValue, next = () => null) {
    this.setState({ [dataName]: dataValue }, next)
    sessionStorage.setItem('connexion-data', JSON.stringify({
      id: this.state.id,
      password: this.state.password,
      isEmail: this.toggleNumber,
      cb: this.state.cb,
      [dataName]: dataValue
    }))
  }

  login(e) {
    e.preventDefault()
    if (this.state.connexionLoading)
      return
    const trusted = this.state.cb
    const callback = () => axios
      .post(`${url}/connexion`, {
        id: this.state.id,
        password: this.state.password,
        isEmail: this.toggleNumber,
        trusted,
        device: device()
      })
      .finally(() => this.setState({ connexionLoading: false }))
      .then(({ data }) => {
        const { device, ...res } = data
        this.props.setUser(res)
        localStorage.setItem('device', JSON.stringify({
          trusted,
          id: device
        }))
      })
      .then(() => this.props.history.replace(''))
      .catch(err => {
        if (err.response)
          this.errorHandler(err.response.data)
        else
          this.context.addNotification({
            type: NotificationTypes.ERROR,
            message: 'Une erreur s\'est produite :('
          })
      })

    this.setState({ connexionLoading: true }, callback)
  }

  errorHandler(error) {
    let type = NotificationTypes.ERROR
    let next = () => null
    switch (error) {
      case 'utilisateur inconnu':
        type = NotificationTypes.UNKNOWN_ID
        next = () => {
          this.id.classList.toggle('username-incorrect', true)
          this.id.select()
        }
        break
      case 'mot de passe incorrecte':
        type = NotificationTypes.INVALID_PASSWORD
        this.#password.errorHandler()
        break
      default:
        console.log('cas d\'erreur de connexion non géré')
        error = 'erreur serveur'
        break
    }

    this.context.addNotification({
      type,
      message: error
    }, next)
  }

  toggleSwitch() {
    let toggleContainer = document.getElementById('toggle-switch')

    this.toggleNumber = !this.toggleNumber
    if (this.toggleNumber) {
      toggleContainer.style.clipPath = 'inset(0 0 0 50%)'
      toggleContainer.style.backgroundColor = '#D74046'
      this.setState({ placeholder: 'prado-raso@mail.com', inputType: 'email' })
    } else {
      toggleContainer.style.clipPath = 'inset(0 50% 0 0)'
      toggleContainer.style.backgroundColor = '#1e90ff'
      this.setState({ placeholder: 'username', inputType: 'text' })
    }
  }

  componentDidMount() {
    window.onbeforeunload = () => (this.loading = true) && this.setState({ id: '', password: '' })

    if (this.fromInscription) {
      this.context.addNotification({
        type: NotificationTypes.INSCRIPTION_SUCCEED
      })
      this.#password.focus()
    }

    if (this.fromEmailVerification !== undefined) {
      if (this.fromEmailVerification === '1')
        this.context.addNotification({
          type: NotificationTypes.ERROR,
          message: 'ce lien n\'est plus valide'
        })
      else if (this.fromEmailVerification === '0')
        this.context.addNotification({ type: NotificationTypes.EMAIL_VERIFICATION_FAILED })
      else
        this.context.addNotification({ type: NotificationTypes.EMAIL_VERIFICATION_SUCCEED })
    }

    let toggle = document.getElementById('switch')

    toggle.addEventListener('click', () => {
      this.changeData('id', '')
      this.toggleSwitch()
    })

    if (localStorage.getItem('firstTime') !== null) {
      setTimeout(() => toggle.click(), 1000)
      setTimeout(() => toggle.click(), 2000)
      localStorage.setItem('firstTime', new Date().toUTCString())
    }

    if (this.state.isEmail)
      this.toggleSwitch()
  }

  componentWillUnmount() {
    if (!this.loading)
      sessionStorage.removeItem('connexion-data')
  }

  render() {
    return (
      <form className="connexion-container" onSubmit={this.login}>
        <header>Connexion</header>
        <div className="input-group">
          <div className="switch" id="switch">
            <div className="inner-switch">
              <div className="toggle">
                <p>email</p>
              </div>
              <div className="toggle">
                <p>username</p>
              </div>
            </div>
            <div className="inner-switch" id='toggle-switch'>
              <div className="toggle">
                <p>email</p>
              </div>
              <div className="toggle">
                <p>username</p>
              </div>
            </div>
          </div>
          <input value={this.state.id} onChange={e => this.changeData('id', e.target.value)} required
                 className="input" placeholder={this.state.placeholder} type={this.state.inputType}
                 autoComplete={this.state.inputType === 'text' ? 'username' : 'email'} ref={id => this.id = id}
          />
        </div>
        <InputPasswords changeData={this.changeData} value={this.state.password} ref={p => this.#password = p} one/>
        <div className="save-browser">
          <input type="checkbox" id="cb" checked={this.state.cb}
                 onChange={e => this.changeData('cb', e.target.checked)}
          />
          <label htmlFor="cb">Enregistrer cet appareil</label>
        </div>
        <div className="btns">
          <button className="btn" type="submit">
            {this.state.connexionLoading ? 'Chargement' : <><Lock/>Connexion</>}
          </button>
        </div>
      </form>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps, { setUser })(Connexion)
