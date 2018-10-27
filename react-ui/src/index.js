import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './components/connexion'
import registerServiceWorker from './registerServiceWorker'
import App from './App/index'
import {Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/header'
import Inscription from './components/Inscription'
import {store, history} from './redux/store'
import {Provider} from 'react-redux'

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history}>
                <div>
                    <Header/>
                    <Switch >
                        <Route exact path="/" component={App} />
                        <Route path="/inscription" component={Inscription} />
                        <Route path="/connexion" component={Connexion} />
                        <Route render={() => <Redirect to="/"/>} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    </div>,
  document.getElementById('root')
)

registerServiceWorker()