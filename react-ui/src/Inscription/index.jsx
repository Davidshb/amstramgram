import React from 'react'
import { connect } from 'react-redux'
import { setUser } from '../redux/actions'
import isEmail from 'validator/lib/isEmail'
import axios from 'axios'
import { InputDateDeNaissance, InputEmail, InputNames, InputPasswords, InputSexe, InputUsername } from '../Modules'
import { SettingsBackupRestore, Lock } from '@material-ui/icons'
import { notificationContext } from '../Provider/NotificationProvider'
import { checkDateValidity, NotificationTypes, url } from '../lib/js'
import './style.scss'

class Inscription extends React.Component {

  static contextType = notificationContext
  #email
  #pwd
  #username
  loading = false

  constructor(props, context) {
    super(props, context)
    window.history.replaceState(null, null, window.location.pathname)

    const state = {
      inscriptionLoading: false,
      usernameError: false,
      usernameValidation: false,
      usernameValid: true,
      data: {
        lname: '',
        fname: '',
        pwd: ['', ''],
        email: '',
        sexe: '',
        date: '',
        username: ''
      }
    }

    const data = JSON.parse(sessionStorage.getItem('inscription-data'))
    this.state = data ? { ...state, data } : state

    this.verifyUsername = this.verifyUsername.bind(this)
    this.changeData = this.changeData.bind(this)
    this.deleteData = this.deleteData.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  verifyUsername(next = () => null) {
    let cb = () => axios
      .post(url + '/verifyUsername', { username: this.state.data.username })
      .then(res => this.setState({ usernameValid: res.data }))
      .catch(err => this.setState({ usernameValid: false }) && this.errorHandler(err.message))
      .finally(() => this.setState({ usernameValidation: false }))
      .finally(next)
    this.setState({ usernameValidation: true }, cb)
  }

  changeData(dataName, dataValue, next = () => null) {
    let data = this.state.data
    data[dataName] = dataValue
    this.setState({ data }, next)
    sessionStorage.setItem('inscription-data', JSON.stringify(data))
  }

  deleteData(remove = true) {
    let data = {}
    Object.keys(this.state.data).forEach(v => data[v] = '')
    data.pwd = ['', '']
    this.setState({ data })

    if (remove)
      sessionStorage.removeItem('inscription-data')
  }

  signUp(e) {
    e.preventDefault()
    if (this.state.inscriptionLoading || this.state.disableButton)
      return

    const callback = () => axios
      .post(`${url}/inscription`, this.state.data)
      .finally(() => this.setState({ inscriptionLoading: false }))
      .then(res => res && this.props.history.replace('/connexion', { username: this.state.data.username }))
      .catch(err => err.response && this.errorHandler(err.response.data))

    this.setState({ inscriptionLoading: true }, callback)
  }

  errorHandler(error) {
    let type = NotificationTypes.ERROR

    switch (error) {
      case 'Les mots de passes sont différents':
        this.#pwd.errorHandler()
        break
      case 'Le mot de passe est trop court':
        this.#pwd.errorHandler()
        break
      case 'Ce nom d\'utilisateur est déjà utilisé':
        type = NotificationTypes.INVALID_USERNAME
        this.#username.errorHandler()
        break
      case 'l\'email est utilisé' :
        this.#email.errorHandler()
        break
      case 'l\'email n\'est pas valide':
        this.#email.errorHandler()
        break
      default:
        console.log('cas d\'erreur d\'inscription non géré')
        error = 'erreur système'
        break
    }

    this.context.addNotification({
      type,
      message: error
    })
  }

  componentDidMount() {
    window.onbeforeunload = () => (this.loading = true) && this.deleteData(false)
  }

  componentWillUnmount() {
    if (!this.loading)
      sessionStorage.removeItem('inscription-data')
  }

  render() {
    const data = this.state.data
    const disableButton = !(data.lname.length > 2 && data.fname.length > 2 && isEmail(data.email) > 0 &&
      data.pwd[0].length >= 8 && data.pwd[1].length >= 8 && data.sexe.length !== 0 &&
      !this.state.usernameValidation && this.state.usernameValid && data.username !== '' &&
      data.pwd[0] === data.pwd[1] && checkDateValidity(data.date))
    return (
      <form className="inscription-container" onSubmit={this.signUp}>
        <header>Inscription</header>
        <InputNames changeData={this.changeData} value={[data.fname, data.lname]}/>
        <InputUsername verifyUsername={this.verifyUsername} value={data.username} ref={_ => this.#username = _}
                       usernameValidation={this.state.usernameValidation} changeData={this.changeData}
                       usernameValid={this.state.usernameValid}
        />
        <InputPasswords changeData={this.changeData} value={data.pwd} ref={_ => this.#pwd = _}/>
        <InputSexe changeData={this.changeData} value={data.sexe}/>
        <InputEmail changeData={this.changeData} value={data.email} ref={_ => this.#email = _}/>
        <InputDateDeNaissance changeData={this.changeData} value={data.date}/>
        <div className="btns">
          <button type="submit" className="btn btn-primary" disabled={disableButton}>
            {this.state.inscriptionLoading ? 'Chargement' : <><Lock/>Créer un compte</>}
          </button>
          <button type="reset" className="btn" onClick={this.deleteData}>
            <SettingsBackupRestore/>
            Effacer
          </button>
        </div>
      </form>
    )
  }
}

export default connect(() => Object.create(null), { setUser })(Inscription)
