import React, { Component } from 'react'
import { ChangeColor, PASSWORD_MAX_VALUE, PASSWORD_MIN_VALUE } from '../../lib/js'
import './style.scss'

class Passwords extends Component {
  #cc

  state = {
    class: ''
  }

  constructor (props) {
    super(props)
    this.#cc = new ChangeColor('pwd')
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
    this.verification = this.verification.bind(this)
  }

  changeClass (color) {
    this.setState({ class: this.#cc.toggleColor(color) })
  }

  verification (fromFirstInput = false) {
    let pwd = this.pwd
    let pwd_value = this.props.value

    if (pwd_value[0] === pwd_value[1] === '')
      return

    if (pwd[0].validity.valid && pwd[1].validity.valid && pwd_value[0] === pwd_value[1])
      this.changeClass(ChangeColor.correct)
    else if (!fromFirstInput)
      this.changeClass(ChangeColor.incorrect)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.handleError === true) {
      this.changeClass(ChangeColor.incorrect)
      this.props.changeData('pwd', ['', ''], () => this.pwd[0].focus())
    }

    if (nextProps.value[0] === nextProps.value[1] === '')
      this.changeClass(ChangeColor.normal)
  }

  passwordChangeHandler () {
    this.props.changeData('pwd', [this.pwd[0].value, this.pwd[1].value])
  }

  componentDidMount () {
    this.pwd = document.getElementsByName('pwd')
  }

  render () {
    const pwd = this.props.value

    return (
      <div className="input-group">
        <span className="label">Mot de passe</span>
        <div className="inputs">
          <input type="password" className={'input' + this.state.class} min={PASSWORD_MIN_VALUE}
                 max={PASSWORD_MAX_VALUE} onBlur={() => this.verification(true)} required
                 placeholder="mot de passe" name="pwd" onChange={this.passwordChangeHandler} value={pwd[0]}
                 onFocus={() => this.changeClass(ChangeColor.normal)} autoComplete="new-password"
          />
          <input type="password" className={'input' + this.state.class} min={PASSWORD_MIN_VALUE}
                 max={PASSWORD_MAX_VALUE} placeholder="mot de passe" name="pwd" required autoComplete="new-password"
                 onChange={this.passwordChangeHandler} value={pwd[1]} onBlur={this.verification}
          />
        </div>
      </div>
    )
  }
}

export default Passwords
