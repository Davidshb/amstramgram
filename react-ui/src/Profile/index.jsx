import React from 'react'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { Button } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'
import { setAuthToken } from '../lib/js'
import { removeUser } from '../redux/user/action'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout() {
    setAuthToken()
    localStorage.setItem('auto-connect', 'false')
    this.props.removeUser()
    this.props.history.push('/')
  }

  render() {
    return (
      <div className={styles.logout}>
        <Button variant="contained" color="secondary" onClick={this.logout}>
          <HighlightOff/>
          Se déconnecter
        </Button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, { removeUser })(Profile)
