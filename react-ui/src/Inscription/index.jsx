import React from 'react'
import { connect } from 'react-redux'
import { deleteData, signUp, changeData, verifyUsername, removeError } from '../redux/actions'
import { DateDeNaissance, Email, Names, Passwords, Sexe, Username } from './Inputs'
import './Inputs/style.css'
import { Send, SettingsBackupRestore } from '@material-ui/icons'
import { notification } from '../Provider/NotificationProvider'
import { NotificationTypes } from '../lib/js'

class Inscription extends React.Component {

  state = {
    inscriptionLoading: false,
    pwdError: false,
    emailError: false,
    usernameError: false
  }

  componentDidMount () {
    let data = JSON.parse(sessionStorage.getItem('inscription-data'))
    if (data) this.props.changeData(data)
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
      this.context
          .addNotification({
            type: NotificationTypes.ERROR,
            message: nextProps.error
          }, this.handleError(nextProps.error))
    }
  }

  componentWillUnmount () {
    this.props.deleteData()
    sessionStorage.removeItem('inscription-data')
  }

  creerUnCompte () {
    if (this.state.inscriptionLoading)
      return

    this.setState({ inscriptionLoading: true }, () => this.props.signUp(
      this.props.data,
      () => this.setState({ inscriptionLoading: false }, /*() => this.props.history.push('/')*/)
    ))
  }

  render () {
    return (
      <div className="container">
        <div className="form-group border p-2 needs-validation">
          <div className="form-header border col">Inscription</div>
          <hr/>
          <Names changeData={this.props.changeData} value={[this.props.data.fname, this.props.data.lname]}/>
          <Username {...this.props.usernameProps} verifyUsername={this.props.verifyUsername}
                    changeData={this.props.changeData} handleError={this.state.usernameError}/>
          <Passwords changeData={this.props.changeData} value={this.props.data.pwd} handleError={this.state.pwdError}/>
          <Sexe changeData={this.props.changeData} value={this.props.data.sexe}/>
          <Email changeData={this.props.changeData} value={this.props.data.email} handleError={this.state.emailError}/>
          <DateDeNaissance changeData={this.props.changeData} value={this.props.data.date}/>
          <br/>
          <hr/>
          <div className="btns">
            <button
              type="submit" className="btn btn-primary"
              onClick={this.creerUnCompte.bind(this)}
              disabled={this.props.disableButton}
            >
              {this.state.inscriptionLoading ? 'Chargement' : <><Send/>Créer un compte</>}
            </button>
            <button type="reset" className="btn btn-secondary" onClick={this.props.deleteData}>
              <SettingsBackupRestore/>
              Effacer
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user.user,
    data: state.inscription.data,
    disableButton: state.inscription.disableButton,
    usernameProps: {
      value: state.inscription.data.username,
      usernameValid: state.inscription.usernameValid,
      usernameValidation: state.inscription.usernameValidation
    },
    error: state.inscription.error
  }
}

Inscription.contextType = notification

export default connect(mapStateToProps, { signUp, deleteData, changeData, verifyUsername, removeError })(Inscription)
