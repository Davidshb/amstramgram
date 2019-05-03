import React from 'react'

class Email extends React.Component {
  #email

  emailChangeHandler () {
    this.props.changeData('email', this.#email.value)
  }

  componentDidMount () {
    this.#email = document.getElementById('email')
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.handleError) {
      this.props.changeData('email', '')
      this.#email.focus()
    }
  }

  render () {
    return (
      <div className="input-group">
          <span className="label">Email</span>
        <input type="email" className="input" aria-describedby="Tilt" id="email"
               placeholder="prado-raso@mail.com" value={this.props.value} onChange={this.emailChangeHandler.bind(this)}
               required autoComplete="email"
        />
      </div>
    )
  }
}

export default Email
