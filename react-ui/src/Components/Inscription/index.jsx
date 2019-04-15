import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteData, signUp } from '../../redux/actions'
import { Names, Username, DateDeNaissance, Sexe, Email, Passwords } from './Inputs'
import './Inputs/style.css'
import { SettingsBackupRestore, Send } from '@material-ui/icons'
import { Container } from 'react-bootstrap'

class Inscription extends Component {
  constructor (props) {
    super(props)
    if (this.props.isAuth)
      this.props.history.push('/')

    this.state = {
      inscriptionLoading: false
    }

    this.creerUnCompte = this.creerUnCompte.bind(this)
  }

  creerUnCompte () {
    if (this.state.inscriptionLoading)
      return

    this.setState({ inscriptionLoading: true },
      () => this.props.signUp(
        this.props.data,
        () => this.setState({ inscriptionLoading: false },
          () => this.props.history.push("/")
          )
      )
    )
  }

  render () {
    const loading = () => {
      if (!this.state.inscriptionLoading)
        return (
          <>
            <Send/>
            Créer un compte
          </>
        )

      return "Chargement"
    }

    return (
      <Container>
        <div className="form-group border p-2 needs-validation">
          <div className="form-header border col">Inscription</div>
          <hr/>
          <Names/>
          <Username/>
          <Passwords/>
          <Sexe/>
          <Email/>
          <DateDeNaissance/>
          <br/>
          <hr/>
          <div className="btns">
            <button
              type="submit" className="btn btn-primary"
              onClick={this.creerUnCompte}
              disabled={this.props.disableButton}
            >
              {loading()}
            </button>
            <button type="reset" className="btn btn-secondary" onClick={this.props.deleteData}>
              <SettingsBackupRestore/>
              Effacer
            </button>
          </div>
        </div>
      </Container>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user.user,
    data: state.inscription.data,
    disableButton: state.inscription.disableButton
  }
}

export default connect(mapStateToProps, { signUp, deleteData })(Inscription)
