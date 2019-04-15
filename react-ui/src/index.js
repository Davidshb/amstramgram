import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './Components/Connexion'
import App from './App'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Components/Header'
import Inscription from './Components/Inscription'
import { store, history } from './redux/store'
import { Provider } from 'react-redux'

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
      <>
        <Header history={history}/>
        <Switch>
          <Route path="/" component={App} exact/>
          <Route path="/search" render={() => {
            let search = new URLSearchParams(window.location.search).get('q')
            return (
              <div className="container">
                {search}
              </div>
            )
          }} exact/>
          <PrivateRoute path="/inscription" component={Inscription} exact/>
          <PrivateRoute path="/connexion" component={Connexion} exact/>
          <Route render={() => <Redirect to="/"/>}/>
        </Switch>
      </>
    </Router>
  </Provider>,
  document.getElementById('root')
)
