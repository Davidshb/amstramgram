import React from 'react'
import ReactDOM from 'react-dom'
import Connexion from './Connexion'
import App from './App'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Header'
import Inscription from './Inscription'
import { store, history } from './redux/store'
import { Provider } from 'react-redux'
import Params from './Params'
import NotificationProvider from './Provider/NotificationProvider'
import moment from 'moment'

moment.updateLocale('fr', require('moment/locale/fr'))

/**
 * Si un utilisateur est loggé il n'a pas le droit d'accéder à des pages et inversement il accède s'il ne l'est pas
 * reverse=true => l'utilisateur doit être loggé
 * reverse=false => l'utilisateur ne doit pas l'être
 * @param Component
 * @param reverse {Boolean}
 * @param reste {Object}
 * @returns {*}
 * @constructor
 */
function PrivateRoute({ Component, reverse = false, ...reste }) {
	if (reverse)
		return (
			<Route
				{...reste}
				render={props => store.getState().user.user //check if the user variable is null or not
					? <Component {...props} />
					: <Redirect to={{ pathname: '/', state: { from: props.location } }}/>
				}
			/>
		)
	return (
		<Route
			{...reste}
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
				<Switch>
					<Route path={['/', '/connexion', '/inscription', '/search', '/user/*']}
								 render={props => <Header history={history} {...props}/>} exact={true}/>
				</Switch>
				<Switch>
					<Route path="/" component={App} exact/>
					<Route path="/search" render={({ match }) => {
						const p = match.params['research']
						if (!p || p === '') history.replace('/')
						return (
							<div className="container">
								{p}
								en Développement
							</div>
						)
					}} exact/>
					<PrivateRoute path="/inscription" Component={Inscription} exact/>
					<PrivateRoute path="/connexion" Component={Connexion} exact/>
					<PrivateRoute path="/settings" reverse={true} Component={Params} exact/>
					{/*<PrivateRoute path="/user/:id" reverse={true} Component={null} exact/>*/}
					<Route render={() => <Redirect to="/"/>}/>
				</Switch>
			</NotificationProvider>
		</Router>
	</Provider>,
	document.getElementById('root')
)

module.hot.accept()
