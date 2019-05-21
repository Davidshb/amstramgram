import React from 'react'

class Email extends React.Component {
  #email

  errorHandler() {
    this.#email.focus()
  }

  render() {
    return (
      <div className="input-group">
        <span className="label">Email</span>
        <input type="email" className="input" ref={email => this.#email = email} required
               placeholder="prado-raso@mail.com" value={this.props.value} autoComplete="email"
               onChange={() => this.props.changeData('email', this.#email.value)}
        />
      </div>
    )
  }
}

export default Email
