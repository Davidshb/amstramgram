import React from 'react'
import { REGEXP_USERNAME, TIME_UNTIL_USERNAME_VERIFICATION } from '../../lib/js'
import './style.scss'

export default class Username extends React.Component {
  #username
  static #normal = 1
  static #correct = 2
  static #incorrect = 3

  constructor(props) {
    super(props)

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
    this.verifyUsername = this.verifyUsername.bind(this)
    this.usernameBlurHandler = this.usernameBlurHandler.bind(this)
    this.usernameFocusHandler = this.usernameFocusHandler.bind(this)
    this.errorHandler = this.errorHandler.bind(this)
  }

  static usernameClickHandler(e) {
    e.preventDefault()
    if (e.target.selectionStart === 0)
      e.target.setSelectionRange(e.target.value.length, e.target.value.length)
  }

  verifyUsername() {
    this.props.verifyUsername(() => this.toggleClass(this.props.usernameValid ? Username.#correct : Username.#incorrect))
  }

  usernameFocusHandler() {
    this.toggleClass(Username.#normal)
  }

  usernameBlurHandler(e) {
    if (e.target.value !== '' && !e.target.validity.valid)
      this.toggleClass(Username.#incorrect)
  }

  toggleClass(c) {
    this.#username.classList.toggle('username-normal', c === Username.#normal)
    this.#username.classList.toggle('username-correct', c === Username.#correct)
    this.#username.classList.toggle('username-incorrect', c === Username.#incorrect)
  }

  usernameChangeHandler(e) {
    e.persist()
    let classList = e.target.classList
    classList.remove('username-correct', 'username-incorrect')
    let txt = e.target.value.slice(1)

    if (this.usernameProcessing) {
      clearTimeout(this.usernameProcessing)
      this.usernameProcessing = null
    }

    this.props.changeData('username', txt, () => {
      if (this.props.value.length < 5 || !e.target.validity.valid)
        return classList.add('username-normal')

      this.usernameProcessing = setTimeout(() => {
        this.usernameProcessing = null
        e.target.blur()
        this.verifyUsername()
      }, TIME_UNTIL_USERNAME_VERIFICATION)
    })
  }

  componentDidMount() {
    if (this.props.value !== '')
      this.verifyUsername()
  }

  errorHandler() {
    this.toggleClass(Username.#incorrect)
    this.props.usernameValid = false
    this.#username.focus()
    this.#username.select()
  }

  render() {
    return (
      <div className="input-group">
        <span className="label">Username</span>
        <input id="username" className="input" aria-describedby="Tilt" type="text" ref={input => this.#username = input}
               value={'@' + this.props.value} maxLength="16" required pattern={REGEXP_USERNAME} autoComplete="username"
               onChange={this.usernameChangeHandler} onClick={Username.usernameClickHandler}
               onSelect={Username.usernameClickHandler} readOnly={this.props.usernameValidation}
               onBlur={this.usernameBlurHandler} onFocus={this.usernameFocusHandler}
        />
      </div>
    )
  }
}
