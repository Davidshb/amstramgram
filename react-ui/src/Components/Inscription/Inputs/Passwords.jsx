import React, {Component} from 'react'
import {connect} from "react-redux"
import {changeData} from "../../../redux/actions";
import {ChangeColor, PASSWORD_MAX_VALUE, PASSWORD_MIN_VALUE} from "../../../lib/js";

class Passwords extends Component {
	#cc = null
	#pwd = null

	constructor(props) {
		super(props)

		this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
		this.verification = this.verification.bind(this)
		this.reset = this.reset.bind(this)
	}

	verification() {
		if(this.#pwd[0].validity.valid && this.#pwd[1].validity.valid && this.props.pwd1 === this.props.pwd2)
			this.#cc.change(ChangeColor.correct)
		else
			this.#cc.change(ChangeColor.incorrect)
	}

	reset() {
		this.#cc.change(ChangeColor.normal)
	}

	passwordChangeHandler(e) {
		this.props.changeData(e.target.id,e.target.value)
	}

componentDidMount() {
	this.#pwd = document.getElementsByName("pwd")
	this.#cc = new ChangeColor("pwd",this.#pwd)

	if(this.#pwd.length !== 2)
		throw Error("Don't touch my code")
	}

	render() {
		return (
			<div className="mb-2">
				<div className="input-group form-row">
					<div className="input-group-prepend col-sm-3">
						<span className="input-group-text w-100 d-block text-center">Mot de passe</span>
					</div>
					<input type="password" className="form-control col" min={PASSWORD_MIN_VALUE} max={PASSWORD_MAX_VALUE} id="pwd"
								 required aria-describedby="psdHelp" placeholder="mot de passe" name ="pwd" value={this.props.pwd1}
								 onChange={this.passwordChangeHandler} onFocus={this.reset}
					/>
					<input type="password" className="form-control col" min={PASSWORD_MIN_VALUE} max={PASSWORD_MAX_VALUE} id="pwd2"
								 required aria-describedby="psdHelp" placeholder="mot de passe" name ="pwd" value={this.props.pwd2}
								 onChange={this.passwordChangeHandler} onBlur={this.verification} onFocus={this.reset}
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
		pwd1: state.inscription.data.pwd1,
		pwd2: state.inscription.data.pwd2
	}
}

export default connect(mapStateToProps,{changeData})(Passwords)