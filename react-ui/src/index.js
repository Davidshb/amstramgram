import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './Components/Connexion'
import App from './App/index'
import {Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Components/Header'
import Inscription from './Components/Inscription'
import {store, history} from './redux/store'
import {Provider} from 'react-redux'

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history}>
                <div>
                    <Header history={history}/>
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