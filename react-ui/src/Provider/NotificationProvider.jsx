import React from 'react'
//https://teodosii.github.io/react-notifications-component/
import Notification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './react-notifications-component.css'
import { getNotification } from '../lib/js'

export const notificationContext = React.createContext({
  addNotification: () => null
})

class NotificationProvider extends React.Component {

  constructor(props) {
    super(props)
    this.notif = React.createRef()

    this.addNotification = this.addNotification.bind(this)

    this.state = {
      addNotification: this.addNotification
    }
  }

  addNotification(params, next = () => null) {
    this.notif.current.addNotification(getNotification(params))
    next()
  }

  render() {
    return (
      <notificationContext.Provider value={this.state}>
        <Notification ref={this.notif}/>
        {this.props.children}
      </notificationContext.Provider>
    )
  }
}

export default NotificationProvider
