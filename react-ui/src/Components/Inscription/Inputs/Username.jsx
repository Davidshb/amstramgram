import React, {Component} from "react"
import {connect} from "react-redux";
import {verifyUsername, changeData} from "../../../redux/actions";
import {REGEXP_USERNAME, TIME_UNTIL_USERNAME_VERIFICATION} from "../../../lib/js";


class Username extends Component {
	constructor(props) {
		super(props)

		this.usernameProcessing = null

		this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
	}

	static usernameClickHandler (e) {
		e.preventDefault()
		if (e.target.selectionStart === 0)
			e.target.setSelectionRange(e.target.value.length, e.target.value.length)
	}

	usernameChangeHandler(e) {
		e.persist()
		let classList = e.target.classList
		classList.remove("username-correct","username-incorrect")
		let txt = e.target.value.slice(1)

		if(this.usernameProcessing)
			clearTimeout(this.usernameProcessing)

		this.props.changeData("username",txt,() => {
			if (this.props.username.length < 5 || !e.target.validity.valid)
				return classList.add("username-normal")

			this.usernameProcessing = setTimeout(() => {
				this.usernameProcessing = null
				e.target.blur()
				this.props.verifyUsername(this.props.username, () => {
					classList.remove("username-normal")
					classList.toggle("username-correct",this.props.usernameValid)
					classList.toggle("username-incorrect",!this.props.usernameValid)
				})
			}, TIME_UNTIL_USERNAME_VERIFICATION)
		})
	}

	render() {
		return (
			<div className="input-group mb-3 form-row">
				<div className="input-group-prepend col-sm-3">
					<span className="input-group-text w-100 d-block text-center">@Username</span>
				</div>
				<div className="input-group col">
					<input id="username" className="form-control" aria-describedby="Tilt" type="text"
								 value={'@' + this.props.username} maxLength="16" required pattern={REGEXP_USERNAME}
								 onChange={this.usernameChangeHandler} onClick={Username.usernameClickHandler} autoComplete="username"
								 onSelect={Username.usernameClickHandler} readOnly={this.props.usernameValidation}
					/>
					<span className="invalid-feedback">doesn't look good !</span>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		username: state.inscription.data.username,
		usernameValid: state.inscription.usernameValid,
		usernameValidation: state.inscription.usernameValidation
	}
}

export default connect(mapStateToProps,{verifyUsername, changeData})(Username)
