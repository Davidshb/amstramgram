import React from 'react'

class Email extends React.Component {
  #email

  emailChangeHandler () {
    this.props.changeData('email', this.#email.value)
  }

  componentDidMount () {
    this.#email = document.getElementById('email')
  }

  render () {
    return (
      <div className="input-group mb-3 form-row">
        <div className="input-group-prepend col-sm-3">
          <span className="input-group-text d-block text-center w-100">Email</span>
        </div>
        <input type="email" className="to-valid form-control text-center col" aria-describedby="Tilt" id="email"
               placeholder="prado-raso@mail.com" value={this.props.value} onChange={this.emailChangeHandler.bind(this)}
               required autoComplete="email"
        />
      </div>
    )
  }
}

export default Email
