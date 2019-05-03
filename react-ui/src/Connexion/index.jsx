import React from 'react'
import { connect } from 'react-redux'
import { setUser } from '../redux/actions'
import './style.scss'

class Connexion extends React.Component {
  componentDidMount () {
    const st = {}

    st.flap = document.querySelector('#flap')
    st.toggle = document.querySelector('.toggle')

    st.choice1 = document.querySelector('#choice1')
    st.choice2 = document.querySelector('#choice2')

    st.flap.addEventListener('transitionend', () => {

      if (st.choice1.checked) {
        st.toggle.style.transform = 'rotateY(-15deg)'
        setTimeout(() => st.toggle.style.transform = '', 400)
      } else {
        st.toggle.style.transform = 'rotateY(15deg)'
        setTimeout(() => st.toggle.style.transform = '', 400)
      }

    })

    st.clickHandler = (e) => {

      if (e.target.tagName === 'LABEL') {
        setTimeout(() => {
          st.flap.children[0].textContent = e.target.textContent
        }, 250)
      }
    }

    this.flap = document.addEventListener('DOMContentLoaded', () => {
      st.flap.children[0].textContent = st.choice2.nextElementSibling.textContent
    })

    this.st = document.addEventListener('click', (e) => st.clickHandler(e))
  }

  componentWillUnmount () {
    document.removeEventListener('DOMContentLoaded', this.flap)
    document.removeEventListener('click', this.st)
  }

  render () {
    return (
      <div className="container">
        <header>Connexion</header>
        <div className="switch">
          <form className="toggle">
            <input type="radio" id="choice1" name="choice" value="creative"/>
            <label htmlFor="choice1">email</label>
            <input type="radio" id="choice2" name="choice" value="productive"/>
            <label htmlFor="choice2">username</label>
            <div id="flap"><span className="content">productive</span></div>
          </form>
        </div>

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, { setUser })(Connexion)
