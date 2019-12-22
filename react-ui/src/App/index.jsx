import React from 'react'
import { connect } from 'react-redux'
import Slider from '../lib/js/Slider'
import styles from './style.module.scss'
import { Link } from 'react-router-dom'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: []
    }

    if (props.user) {
      axios
        .get('/api/posts')
        .then(res => this.setState(prevState => ({ posts: prevState.posts.concat(res.data) })))
    }
  }

  render() {
    if (!this.props.user)
      return <NotConnect/>
    return (
      <>
        <div className={styles.container}>
        </div>
        <div className={styles.side}>
        </div>
      </>
    )
  }
}

const NotConnect = () =>
  <div className={styles['not-connect']}>
    <Slider/>
    <span>
      Publiez vos photos et réagissez à celles de vos amis ! <br/>
      <Link to="/inscription">Inscrivez-vous dès maintenant !</Link>
    </span>
  </div>

function MapStateToProps(state) {
  return {
    user: state.user.user
  }
}

export default connect(MapStateToProps, {})(App)
