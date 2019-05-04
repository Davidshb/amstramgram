import React from 'react'
import { connect } from 'react-redux'
import { setUser } from '../redux/actions'
import { InputPasswords } from '../Modules/'
import { Lock } from '@material-ui/icons'
import './style.scss'

class Connexion extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      disableButton: true,
      id: '',
      password: '',
      placeholder: 'username',
      inputType: 'text'
    }

    this.changeData = this.changeData.bind(this)
    this.login = this.login.bind(this)
  }

  changeData (dataName, dataValue, next = () => null) {
    this.setState({ [dataName]: dataValue }, next)
  }

  componentDidMount () {
    let toggle = document.getElementById('switch')
    let toggleContainer = document.getElementById('toggle-switch')
    let toggleNumber

    toggle.addEventListener('click', () => {
      toggleNumber = !toggleNumber
      if (toggleNumber) {
        toggleContainer.style.clipPath = 'inset(0 0 0 50%)'
        toggleContainer.style.backgroundColor = '#D74046'
        this.setState({ placeholder: 'prado-raso@mail.com', id: '', inputType: 'email' })
      } else {
        toggleContainer.style.clipPath = 'inset(0 50% 0 0)'
        toggleContainer.style.backgroundColor = '#1e90ff'
        this.setState({ placeholder: 'username', id: '', inputType: 'text' })
      }
    })

    if (localStorage.getItem('firstTime') !== null) {
      setTimeout(() => toggle.click(), 1000)
      setTimeout(() => toggle.click(), 2000)
      localStorage.setItem('firstTime', new Date().toUTCString())
    }
  }

  login () {

  }

  render () {
    return (
      <form className="connexion-container" onSubmit={this.login}>
        <header>Connexion</header>
        <div className="input-group">
          <div className="switch" id="switch">
            <div className="inner-switch">
              <div className="toggle">
                <p>email</p>
              </div>
              <div className="toggle">
                <p>username</p>
              </div>
            </div>
            <div className="inner-switch" id='toggle-switch'>
              <div className="toggle">
                <p>email</p>
              </div>
              <div className="toggle">
                <p>username</p>
              </div>
            </div>
          </div>
          <input value={this.state.id} onChange={e => this.changeData('id', e.target.value)}
                 className="input" placeholder={this.state.placeholder} type={this.state.inputType}
                 autoComplete={this.state.inputType === 'text' ? 'username' : 'email'} required
          />
        </div>
        <InputPasswords changeData={this.changeData} value={this.state.password} one/>
        <div className="btns">
          <button className="btn" type="submit">
            <Lock/>
            Connexion
          </button>
        </div>
      </form>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, { setUser })(Connexion)
