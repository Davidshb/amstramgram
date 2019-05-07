import React, { Component } from 'react'
import { ChangeColor, PASSWORD_MAX_VALUE, PASSWORD_MIN_VALUE } from '../../lib/js'
import './style.scss'

class Passwords extends Component {
  #cc
  static incorrect = ChangeColor.incorrect

  constructor (props) {
    super(props)
    this.#cc = new ChangeColor('pwd')
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
    this.verification = this.verification.bind(this)

    this.state = { class: this.#cc.toggleColor(ChangeColor.normal) }
  }

  changeClass (color) {
    this.setState({ class: this.#cc.toggleColor(color) })
  }

  verification (fromFirstInput = false) {
    let pwd = this.pwd
    let pwd_value = this.props.value

    if (this.props['one']) {
      if (pwd_value === '')
        if (this.state.class !== 'pwd-normal')
          this.changeClass(ChangeColor.normal)
      return
    }else if (pwd[0].validity.valid)
        this.changeClass(ChangeColor.correct)
      else
        this.changeClass(ChangeColor.incorrect)

    if (pwd_value[0] === pwd_value[1] === '')
      return

    if (pwd[0].validity.valid && pwd[1].validity.valid && pwd_value[0] === pwd_value[1])
      this.changeClass(ChangeColor.correct)
    else if (!fromFirstInput)
      this.changeClass(ChangeColor.incorrect)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errorHandler === true) {
      this.changeClass(ChangeColor.incorrect)
      if(this.props['one'])
        this.props.changeData('password','', () => this.pwd.focus())
      else
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
        {this.props['one'] === undefined ?
          <div className="inputs">
            <input type="password" className={`input${this.state.class}`} minLength={PASSWORD_MIN_VALUE}
                   maxLength={PASSWORD_MAX_VALUE} onBlur={() => this.verification(true)} required
                   placeholder="mot de passe" name="pwd" onChange={this.passwordChangeHandler} value={pwd[0]}
                   onFocus={() => this.changeClass(ChangeColor.normal)} autoComplete="new-password"
            />
            <input type="password" className={`input${this.state.class}`} minLength={PASSWORD_MIN_VALUE}
                   maxLength={PASSWORD_MAX_VALUE} placeholder="mot de passe" name="pwd" required autoComplete="new-password"
                   onChange={this.passwordChangeHandler} value={pwd[1]} onBlur={this.verification}
            />
          </div> :
          <input type="password" className={`input${this.state.class}`} minLength={PASSWORD_MIN_VALUE} value={pwd}
                 onBlur={this.verification} onChange={e => this.props.changeData('password', e.target.value)} required
                 maxLength={PASSWORD_MAX_VALUE} placeholder="mot de passe" name="pwd" autoComplete="current-password"
                 ref={pwd => this.passwordInput = pwd}
          />
        }
      </div>
    )
  }
}

export default Passwords
