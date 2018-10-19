import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/index'
import {Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/header'
import Inscription from './components/Inscription'
import {store, history} from './redux/store'
import {Provider} from 'react-redux'


ReactDOM.render(
    <div>
        <Router history={history}>
            <Provider store={store}>
                <div>
                    <Header/>
                    <Switch >
                        <Route exact path="/" component={App} />
                        <Route path="/inscription" component={Inscription} />
                        <Route render={() => <Redirect to="/"/>} />
                    </Switch>
                </div>
            </Provider>
        </Router>
    </div>,
  document.getElementById('root')
);