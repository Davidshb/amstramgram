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
  loading = false

  constructor(props, context) {
    super(props, context)

    this.state = {
      inscriptionLoading: false,
      pwdError: false,
      emailError: false,
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
      },
      disableButton: true
    }

    this.toggleButton = this.toggleButton.bind(this)
    this.verifyUsername = this.verifyUsername.bind(this)
    this.changeData = this.changeData.bind(this)
    this.deleteData = this.deleteData.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  toggleButton() {
    const data = this.state.data
    this.setState({
      disableButton: !(data.lname.length > 2 && data.fname.length > 2 && isEmail(data.email) > 0 &&
        data.pwd[0].length >= 8 && data.pwd[1].length >= 8 && data.sexe.length !== 0 &&
        !this.state.usernameValidation && this.state.usernameValid && data.username !== '' &&
        data.pwd[0] === data.pwd[1] && checkDateValidity(data.date))
    })
  }

  verifyUsername(next = () => null) {
    let cb = () => axios
      .post(url + '/verifyUsername', { username: this.state.data.username })
      .then(res => this.setState({ usernameValid: res.data }))
      .catch(err => this.setState({ usernameValid: false }) && this.errorHandler(err.message))
      .finally(this.toggleButton)
      .finally(() => this.setState({ usernameValidation: false }))
      .finally(next)
    this.setState({ usernameValidation: true }, cb)
  }

  changeData(dataName, dataValue, next = () => null) {
    let data = this.state.data
    data[dataName] = dataValue
    this.setState({ data }, next)
    sessionStorage.setItem('inscription-data', JSON.stringify(data))
    this.toggleButton()
  }

  deleteData(remove = true) {
    let data = {}
    Object.keys(this.state.data).forEach(v => data[v] = '')
    data.pwd = ['', '']
    this.setState({ data }, this.toggleButton)

    if (remove)
      sessionStorage.removeItem('inscription-data')
  }

  signUp(e) {
    e.preventDefault()
    if (this.state.inscriptionLoading || this.state.disableButton)
      return

    const callback = () => axios
      .post(`${url}/inscription`, this.state.data)
      .then(res => res && this.props.history.replace('/'))
      //.then(() => this.props.history.replace('/'))
      .catch(err => err.response && this.errorHandler(err.response.data))
      .finally(() => this.setState({ inscriptionLoading: false }))

    this.setState({ inscriptionLoading: true }, callback)
  }

  errorHandler(error) {
    let type = NotificationTypes.ERROR
    let next = () => {}

    switch (error) {
      case 'Les mots de passes sont différents':
        next = () => this.setState({ pwdError: true }, () => this.setState({ pwdError: false }))
        break
      case 'Le mot de passe est trop court':
        next = () => this.setState({ pwdError: true }, () => this.setState({ pwdError: false }))
        break
      case 'Ce nom d\'utilisateur est déjà utilisé':
        type = NotificationTypes.INVALID_USERNAME
        next = () => this.setState({ usernameError: true }, () => this.setState({ usernameError: false }))
        break
      case 'l\'email est utilisé' :
        next = () => this.setState({ emailError: true }, () => this.setState({ emailError: false }))
        break
      case 'l\'email n\'est pas valide':
        next = () => this.setState({ emailError: true }, () => this.setState({ emailError: false }))
        break
      default:
        console.log('cas d\'erreur d\'inscription non géré')
        break
    }

    this.context.addNotification({
      type,
      message: error
    }, next)
  }

  componentDidMount() {
    window.onbeforeunload = () => (this.loading = true) && this.deleteData(false)
  }

  componentWillMount() {
    let data = JSON.parse(sessionStorage.getItem('inscription-data'))
    if (data)
      this.setState({ data })
  }

  componentWillUnmount() {
    if (!this.loading)
      sessionStorage.removeItem('inscription-data')
  }

  render() {
    return (
      <form className="inscription-container" onSubmit={this.signUp}>
        <header>Inscription</header>
        <InputNames changeData={this.changeData} value={[this.state.data.fname, this.state.data.lname]}/>
        <InputUsername verifyUsername={this.verifyUsername} value={this.state.data.username}
                       usernameValidation={this.state.usernameValidation} changeData={this.changeData}
                       handleError={this.state.usernameError} usernameValid={this.state.usernameValid}
        />
        <InputPasswords changeData={this.changeData} value={this.state.data.pwd}
                        handleError={this.state.pwdError}
        />
        <InputSexe changeData={this.changeData} value={this.state.data.sexe}/>
        <InputEmail changeData={this.changeData} value={this.state.data.email}
                    handleError={this.state.emailError}
        />
        <InputDateDeNaissance changeData={this.changeData} value={this.state.data.date}/>
        <div className="btns">
          <button type="submit" className="btn btn-primary" disabled={this.state.disableButton}>
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
