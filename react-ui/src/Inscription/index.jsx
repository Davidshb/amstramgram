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

  constructor (props, context) {
    super(props, context)

    this.state = {
      inscriptionLoading: false,
      pwdError: false,
      emailError: false,
      usernameError: false,
      usernameValidation: false,
      usernameValid: true,
      error: null,
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
    this.removeError = this.removeError.bind(this)
    this.creerUnCompte = this.creerUnCompte.bind(this)
  }

  toggleButton () {
    const data = this.state.data
    this.setState({
      disableButton: !(data.lname.length > 2 && data.fname.length > 2 && isEmail(data.email) > 0 &&
        data.pwd[0].length >= 8 && data.pwd[1].length >= 8 && data.sexe.length !== 0 &&
        !this.state.usernameValidation && this.state.usernameValid && data.username !== '' &&
        data.pwd[0] === data.pwd[1] && checkDateValidity(data.date))
    })
  }

  verifyUsername (param, next = () => null) {
    let cb = () => axios
      .post(url + '/verifyUsername', { param })
      .then(res => this.setState({ usernameValid: res.data, usernameValidation: false }))
      .catch(err => this.setState({ error: err.message, username: '', usernameValid: false }))
      .finally(this.toggleButton)
      .finally(next)
    this.setState({ usernameValidation: true }, cb)
  }

  changeData (dataName, dataValue, next = () => null) {
    let data = this.state.data
    data[dataName] = dataValue
    this.setState({ data }, next)
    this.toggleButton()
  }

  deleteData () {
    let data = {}
    Object.keys(this.state.data).forEach(v => data[v] = '')
    data.pwd = ['', '']
    this.setState({ data }, this.toggleButton)
  }

  signUp (data, next = () => null) {
    return axios
      .post(url + '/inscription', data)
      .then(res => this.props.setUser(res.data))
      .catch(err => err.response && this.setState({ error: err.response.data }))
      .finally(next)
  }

  removeError () {
    this.setState({ error: null })
  }

  componentDidMount () {
    let data = JSON.parse(sessionStorage.getItem('inscription-data'))
    if (data)
      this.setState({ data })
  }

  handleError = error => {
    return () => {
      switch (error) {
        case 'Les mots de passes sont différents':
          this.setState({ pwdError: true }, () => this.setState({ pwdError: false }))
          break
        case 'Le mot de passe est trop court':
          this.setState({ pwdError: true }, () => this.setState({ pwdError: false }))
          break
        case 'le username est utilisé':
          this.setState({ usernameError: true }, () => this.setState({ usernameError: false }))
          break
        case 'l\'email est utilisé' :
          this.setState({ emailError: true }, () => this.setState({ emailError: false }))
          break
        case 'l\'email n\'est pas valide':
          this.setState({ emailError: true }, () => this.setState({ emailError: false }))
          break
        default:
          break
      }
      this.props.removeError()
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const data = JSON.stringify({ ...nextProps.data, pwd: null, username: null })
    if (data !== JSON.stringify(this.props.data))
      sessionStorage.setItem('inscription-data', data)

    if (nextProps.error) {
      this.context.addNotification({
        type: NotificationTypes.ERROR,
        message: nextProps.error
      }, this.handleError(nextProps.error))
    }
  }

  componentWillUnmount () {
    this.deleteData()
    sessionStorage.removeItem('inscription-data')
  }

  creerUnCompte () {
    if (this.state.inscriptionLoading)
      return

    this.setState({ inscriptionLoading: true }, () => this.props.signUp(
      this.props.data,
      () => this.setState({ inscriptionLoading: false }, /*() => this.props.history.push('/')*/) //TODO
    ))
  }

  render () {
    return (
      <div className="container">
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
          <button type="submit" className="btn btn-primary" onClick={this.creerUnCompte.bind(this)}
                  disabled={this.state.disableButton}
          >
            {this.state.inscriptionLoading ? 'Chargement' : <><Lock/>Créer un compte</>}
          </button>
          <button type="reset" className="btn" onClick={this.deleteData}>
            <SettingsBackupRestore/>
            Effacer
          </button>
        </div>
      </div>
    )
  }
}

Inscription.contextType = notificationContext

export default connect(state => {return { user: state.user.user }}, { setUser })(Inscription)
