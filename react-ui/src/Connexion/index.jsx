import React from 'react'
import { connect } from 'react-redux'
import { setUser } from '../redux/actions'
import { InputPasswords } from '../Modules/'
import { Lock } from '@material-ui/icons'
import { notificationContext } from '../Provider/NotificationProvider'
import axios from 'axios'
import { NotificationTypes, url } from '../lib/js'
import './style.scss'

class Connexion extends React.Component {
  toggleNumber = false
  password
  static contextType = notificationContext

  constructor(props) {
    super(props)

    this.state = {
      disableButton: true,
      id: '',
      password: '',
      placeholder: 'username',
      inputType: 'text',
      connexionLoading: false,
      cb: false,
      passwordError: null
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
    const callback = () => axios
      .post(`${url}/connexion`, {
        id: this.state.id,
        password: this.state.password,
        isEmail: this.toggleNumber,
        trust: this.state.cb
      })
      .then(res => {
        const { trust, ...data } = res.data
        if (trust)
          localStorage.setItem('trustToken', trust)
        this.props.setUser(data)
      })
      //.then(() => this.props.history.replace('/'))
      .catch(err => err.response && this.errorHandler(err.response.data))
      .finally(() => this.setState({ connexionLoading: false }))

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
        next = () => {
          this.password.passwordInput.select()
          this.password.changeClass(InputPasswords.incorrect)
        }
        break
      default:
        console.log('cas d\'erreur de connexion non géré')
        break
    }

    this.context.addNotification({
      type,
      message: error
    }, next)
  }

  componentDidMount() {
    window.onbeforeunload = () => (this.loading = true) && this.setState({ id: '', password: '' })

    let toggle = document.getElementById('switch')
    let toggleContainer = document.getElementById('toggle-switch')

    toggle.addEventListener('click', () => {
      this.changeData('id', '')

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
    })

    if (localStorage.getItem('firstTime') !== null) {
      setTimeout(() => toggle.click(), 1000)
      setTimeout(() => toggle.click(), 2000)
      localStorage.setItem('firstTime', new Date().toUTCString())
    }

    const data = JSON.parse(sessionStorage.getItem('connexion-data'))
    if (data) {
      if (data.isEmail)
        toggle.click()
      this.setState({ ...data })
    }
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
        <InputPasswords changeData={this.changeData} value={this.state.password} errorHandler={this.state.passwordError}
                        ref={p => this.password = p} one/>
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
