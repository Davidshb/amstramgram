import React from 'react'
import { setUser } from '../redux/user/action'
import axios from 'axios'
import { device, url, api } from '../lib/js'
import { connect } from 'react-redux'
import styles from './style.module.scss'

class Authentification extends React.Component {

  componentDidMount() {
    if (!window.history.state) {
      window.history.pushState(null, null, '/')
      return
    }

    api.get(`${url}/connexion`, {
      params: {
        token: sessionStorage.getItem('token'),
        device: device(true)
      }
    })
       .then(({ data }) => this.props.setUser(data))
       .then(() => window.history.pushState(null, null, window.history.state.data.url))
       .catch(err => window.history.pushState({ err }, null, '/connexion'))
  }

  render() {
    return (
      <div className={styles.loader}>
        <svg>
          <g>
            <path d="M 50,100 A 1,1 0 0 1 50,0"/>
          </g>
          <g>
            <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
          </g>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF56A1', stopOpacity: 1 }}/>
              <stop offset="100%" style={{ stopColor: '#FF9350', stopOpacity: 1 }}/>
            </linearGradient>
          </defs>
        </svg>
        <p>Chargement</p>
      </div>
    )
  }
}

export default connect(() => ({}), { setUser })(Authentification)
