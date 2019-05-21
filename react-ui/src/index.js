import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './Connexion'
import App from './App'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Components/Header'
import Inscription from './Inscription'
import { store, history } from './redux/store'
import { Provider } from 'react-redux'
import Profile from './Profile'
import NotificationProvider from './Provider/NotificationProvider'
import moment from 'moment'

moment.updateLocale('fr', require('moment/locale/fr'))

function PrivateRoute({ Component, reverse = false, ...rest }) {
  if (reverse)
    return (
      <Route
        {...rest}
        render={props => store.getState().user.user
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
        }
      />
    )
  return (
    <Route
      {...rest}
      render={props => store.getState().user.user
        ? <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
        : <Component {...props}/>
      }
    />
  )
}

ReactDOM.render(
  <Provider
    store={store}>
    <Router
      history={history}>
      <NotificationProvider>
        <Header history={history}/>
        <Switch>
          <Route path="/" component={App} exact/>
          <Route path="/search" render={({ match }) => {
            const p = match.params['research']
            if (!p || p === '') history.replace('/')
            return (
              <div className="container">
                {match.params['research']}
              </div>
            )
          }} exact/>
          <PrivateRoute path="/inscription" Component={Inscription} exact/>
          <PrivateRoute path="/connexion" Component={Connexion} exact/>
          <PrivateRoute path="/:id" reverse={true} Component={Profile} exact/>
          <Route render={() => <Redirect to="/"/>}/>
        </Switch>
      </NotificationProvider>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
)
