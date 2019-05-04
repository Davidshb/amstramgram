import React from 'react'
//https://teodosii.github.io/react-notifications-component/
import Notification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './react-notifications-component.css'
import { getNotification } from '../lib/js'

export const notificationContext = React.createContext({
  notif: null,
  addNotification: () => null
})

class NotificationProvider extends React.Component {
  notif = React.createRef()

  state = {
    notif: this.notif,
    addNotification: this.addNotification
  }

  addNotification (params, next = () => null) {
    const p = getNotification(params)
    this.notif.current.addNotification(p)
    next()
  }

  render () {
    return (
      <notificationContext.Provider value={this.state}>
        <Notification ref={this.notif}/>
        {this.props.children}
      </notificationContext.Provider>
    )
  }
}

export default NotificationProvider
