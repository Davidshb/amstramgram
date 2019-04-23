import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './Connexion'
import App from './App'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Components/Header'
import Inscription from './Inscription'
import { store, history } from './redux/store'
import { Provider } from 'react-redux'
import NotificationProvider from './Provider/NotificationProvider'

function PrivateRoute ({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => store.getState().user.user ? (
        <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
      ) : (
        <Component {...props}/>
      )}
    />
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <NotificationProvider>
        <Header history={history}/>
        <Switch>
          <Route path="/" component={App} exact/>
          <Route path="/search/:research" render={({match}) => {
            if (!match.params.research) history.replace('/')
            return (
              <div className="container">
                {match.params.research}
              </div>
            )
          }} exact/>
          <PrivateRoute path="/inscription" component={Inscription} exact/>
          <PrivateRoute path="/connexion" component={Connexion} exact/>
          <Route render={() => <Redirect to="/"/>}/>
        </Switch>
      </NotificationProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)
