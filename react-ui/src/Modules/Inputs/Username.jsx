import React, { Component } from 'react'
import { NotificationTypes, REGEXP_USERNAME, TIME_UNTIL_USERNAME_VERIFICATION } from '../../lib/js'
import { notificationContext } from '../../Provider/NotificationProvider'
import './style.scss'

class Username extends Component {
  #username

  constructor (props) {
    super(props)

    this.usernameProcessing = null

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
  }

  componentDidMount () {
    this.#username = document.querySelector('#username')
  }

  static usernameClickHandler (e) {
    e.preventDefault()
    if (e.target.selectionStart === 0)
      e.target.setSelectionRange(e.target.value.length, e.target.value.length)
  }

  usernameChangeHandler (e) {
    e.persist()
    let classList = e.target.classList
    classList.remove('username-correct', 'username-incorrect')
    let txt = e.target.value.slice(1)

    if (this.usernameProcessing)
      clearTimeout(this.usernameProcessing)

    this.props.changeData('username', txt, () => {
      if (this.props.value.length < 5 || !e.target.validity.valid)
        return classList.add('username-normal')

      this.usernameProcessing = setTimeout(() => {
        this.usernameProcessing = null
        e.target.blur()
        this.props.verifyUsername(this.props.value, () => {
          classList.remove('username-normal')
          classList.toggle('username-correct', this.props.usernameValid)
          classList.toggle('username-incorrect', !this.props.usernameValid)
          if (!this.props.handleError && !this.props.usernameValid)
            this.context.addNotification({ type: NotificationTypes.INVALID_USERNAME })
        })
      }, TIME_UNTIL_USERNAME_VERIFICATION)
    })
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.handleError) {
      this.#username.classList.remove('username-normal')
      this.#username.classList.remove('username-correct')
      this.#username.classList.toggle('username-incorrect', true)
      this.props.usernameValid = false
      this.#username.focus()
    }

    if (nextProps.value === '') {
      this.#username.classList.toggle('username-normal', true)
      this.#username.classList.remove('username-correct')
      this.#username.classList.remove('username-incorrect')
    }
  }

  render () {
    return (
      <div className="input-group">
        <span className="label">Username</span>
        <input id="username" className="input" aria-describedby="Tilt" type="text"
               value={'@' + this.props.value} maxLength="16" required pattern={REGEXP_USERNAME}
               onChange={this.usernameChangeHandler} onClick={Username.usernameClickHandler} autoComplete="username"
               onSelect={Username.usernameClickHandler} readOnly={this.props.usernameValidation}
        />
      </div>
    )
  }
}

Username.contextType = notificationContext

export default Username
