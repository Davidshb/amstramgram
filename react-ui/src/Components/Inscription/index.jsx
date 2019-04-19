import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteData, signUp, changeData } from '../../redux/actions'
import { DateDeNaissance, Email, Names, Passwords, Sexe, Username } from './Inputs'
import './Inputs/style.css'
import { Send, SettingsBackupRestore } from '@material-ui/icons'

class Inscription extends Component {

  state = {
    inscriptionLoading: false
  }

  creerUnCompte () {
    if (this.state.inscriptionLoading)
      return

    this.setState({ inscriptionLoading: true },
      () => this.props.signUp(
        this.props.data,
        () => this.setState({ inscriptionLoading: false },
          () => this.props.history.push('/')
        )
      )
    )
  }

  render () {
    return (
      <div className="container">
        <div className="form-group border p-2 needs-validation">
          <div className="form-header border col">Inscription</div>
          <hr/>
          <Names changeData={this.props.changeData} value={[this.props.data.fname, this.props.data.lname]}/>
          <Username/>
          <Passwords changeData={this.props.changeData} value={this.props.data.pwd}/>
          <Sexe changeData={this.props.changeData} value={this.props.data.sexe}/>
          <Email changeData={this.props.changeData}/>
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
    disableButton: state.inscription.disableButton
  }
}

export default connect(mapStateToProps, { signUp, deleteData, changeData })(Inscription)
