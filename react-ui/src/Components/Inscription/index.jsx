import React, {Component} from 'react'
import {connect} from "react-redux"
import {deleteData, signUp} from "../../redux/actions/"
import {Names, Username, DateDeNaissance, Sexe, Email, Passwords} from "./Inputs";
import './Inputs/style.css'

class Inscription extends Component {
	constructor(props) {
		super(props)
		if (this.props.isAuth)
			this.props.history.push("/")
	}

	render() {
		return (
			<div className="container">
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
					<button type="submit" className="btn btn-primary btn-lg w-75" onClick={() => this.props.signUp(this.props.data)}
									disabled={this.props.disableButton}> S'inscrire
					</button>
					<button type="reset" className="btn btn-secondary btn-lg w-25" onClick={() => this.props.deleteData()}>
						<i className="material-icons">settings_backup_restore</i>
					</button>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		isAuth: state.user.isAuth,
		user: state.user.user,
		data: state.inscription.data,
		disableButton: state.inscription.disableButton
	}
}

const mapDispatchToProps = {signUp, deleteData}

export default connect(mapStateToProps, mapDispatchToProps)(Inscription)