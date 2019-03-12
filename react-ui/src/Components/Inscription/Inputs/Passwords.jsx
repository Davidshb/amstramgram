import React, {Component} from 'react'
import {connect} from "react-redux"
import {changeData} from "../../../redux/actions";
import {ChangeColor, PASSWORD_MAX_VALUE, PASSWORD_MIN_VALUE} from "../../../lib/js";

class Passwords extends Component {
	#cc = null
	pwd = null
	state = {
		class: ""
	}

	constructor(props) {
		super(props)

		this.#cc = new ChangeColor("pwd", this.pwd)

		this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
	}

	changeClass(color) {
		this.setState({class: this.#cc.toggleColor(color)})
	}

	verification(fromFirstInput=false) {
		let pwd = this.pwd
		let pwd_value = this.props.pwd

		if (pwd[0].validity.valid && pwd[1].validity.valid && pwd_value[0] === pwd_value[1])
			this.changeClass(ChangeColor.correct)
		else if(!fromFirstInput)
			this.changeClass(ChangeColor.incorrect)
	}

	passwordChangeHandler() {
		this.props.changeData('pwd', [this.pwd[0].value, this.pwd[1].value])
	}

	componentDidMount() {
		this.pwd = document.getElementsByName("pwd")
	}

	render() {
		let pwd = this.props.pwd

		return (
			<div className="mb-2">
				<div className="input-group form-row">
					<div className="input-group-prepend col-sm-3">
						<span className="input-group-text w-100 d-block text-center">Mot de passe</span>
					</div>
					<input type="password" className={"form-control col" + this.state.class} min={PASSWORD_MIN_VALUE}
								 max={PASSWORD_MAX_VALUE} onBlur={() => this.verification(true)}
								 required aria-describedby="psdHelp" placeholder="mot de passe" name="pwd"
								 onChange={this.passwordChangeHandler} value={pwd[0]}
								 onFocus={() => this.changeClass(ChangeColor.normal)}
					/>
					<input type="password" className={"form-control col" + this.state.class} min={PASSWORD_MIN_VALUE}
								 max={PASSWORD_MAX_VALUE}
								 required aria-describedby="psdHelp" placeholder="mot de passe" name="pwd"
								 onChange={this.passwordChangeHandler} value={pwd[1]} onBlur={() => this.verification()}
					/>
				</div>

				<small id="psdHelp" className="form-text text-muted">
					Doit être entre 8 et 20 caractères.
				</small>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		pwd: state.inscription.data.pwd
	}
}

export default connect(mapStateToProps, {changeData})(Passwords)