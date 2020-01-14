import React, { Component } from 'react'
import { PASSWORD_MAX_VALUE, PASSWORD_MIN_VALUE } from '../../lib/js'
import './style.scss'

class Passwords extends Component {
	static #correct = 0
	static #incorrect = 1
	static #normal = 2

	#pwd
	#passwordInput

	constructor(props) {
		super(props)
		this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
		this.verification = this.verification.bind(this)
		this.focus = this.focus.bind(this)
		this.disable = this.disable.bind(this)
	}

	disable() {
		if (this.props.one === undefined)
			this.#passwordInput.disabled = true
		else {
			this.#pwd[0].disabled = true
			this.#pwd[1].disabled = true
		}
	}

	enable() {
		if (this.props.one === undefined) {
			this.#passwordInput.disabled = false
			this.#passwordInput.focus()
		} else {
			this.#pwd[0].disabled = false
			this.#pwd[1].disabled = false
			this.#pwd[0].focus()
		}
	}

	focus() {
		this.#passwordInput.focus()
	}

	verification(fromFirstInput = false) {
		const pwd = this.#pwd
		const pwd_value = this.props.value

		if (this.props['one']) {
			if (pwd_value === '')
				this.toggleClass(Passwords.#normal)
			else if (this.#passwordInput.validity.valid)
				this.toggleClass(Passwords.#correct)
			else
				this.toggleClass(Passwords.#incorrect)
			return
		}

		if (pwd_value[0] === pwd_value[1] && pwd_value[1] === '')
			return

		if (pwd[0].validity.valid && pwd[1].validity.valid && pwd_value[0] === pwd_value[1])
			this.toggleClass(Passwords.#correct)
		else if (!fromFirstInput)
			this.toggleClass(Passwords.#incorrect)
	}

	toggleClass(i) {
		if (this.props['one']) {
			this.#passwordInput.classList.toggle('pwd-correct', i === Passwords.#correct)
			this.#passwordInput.classList.toggle('pwd-incorrect', i === Passwords.#incorrect)
			this.#passwordInput.classList.toggle('pwd-normal', i === Passwords.#normal)
		} else
			for (let j = 0; j < 2; j++) {
				this.#pwd[j].classList.toggle('pwd-correct', i === Passwords.#correct)
				this.#pwd[j].classList.toggle('pwd-incorrect', i === Passwords.#incorrect)
				this.#pwd[j].classList.toggle('pwd-normal', i === Passwords.#normal)
			}
	}

	errorHandler() {
		this.toggleClass(Passwords.#incorrect)
		if (this.props['one']) {
			this.props.changeData('password', '', () => this.#passwordInput.focus())
			this.#passwordInput.select()
		} else
			this.props.changeData('pwd', ['', ''], () => this.#pwd[0].focus())
	}

	passwordChangeHandler() {
		this.props.changeData('pwd', [this.#pwd[0].value, this.#pwd[1].value])
	}

	componentDidMount() {
		const pwd = this.props.value

		this.#pwd = document.getElementsByName('pwd')
		if ((this.props['one'] && pwd === '') || pwd[0] === pwd[1] === '')
			this.toggleClass(Passwords.#normal)
	}

	render() {
		const pwd = this.props.value

		return (
			<div className="input-group">
				<span className="label">Mot de passe</span>
				{this.props['one'] === undefined ?
					<div className="inputs">
						<input type="password" className='input pwd-normal' minLength={PASSWORD_MIN_VALUE}
						       maxLength={PASSWORD_MAX_VALUE} onBlur={() => this.verification(true)} required
						       placeholder="mot de passe" name="pwd" onChange={this.passwordChangeHandler} value={pwd[0]}
						       onFocus={() => this.toggleClass(Passwords.#normal)} autoComplete="new-password"
						/>
						<input type="password" className='input pwd-normal' minLength={PASSWORD_MIN_VALUE} required
						       maxLength={PASSWORD_MAX_VALUE} placeholder="mot de passe" name="pwd" autoComplete="new-password"
						       onChange={this.passwordChangeHandler} value={pwd[1]} onBlur={this.verification}
						/>
					</div> :
					<input type="password" className='input pwd-normal' minLength={PASSWORD_MIN_VALUE} value={pwd}
					       onBlur={this.verification} onChange={e => this.props.changeData('password', e.target.value)} required
					       maxLength={PASSWORD_MAX_VALUE} placeholder="mot de passe" autoComplete="current-password"
					       ref={pwd => this.#passwordInput = pwd}
					/>
				}
			</div>
		)
	}
}

export default Passwords
