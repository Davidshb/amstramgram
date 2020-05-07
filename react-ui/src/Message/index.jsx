import React, { Component } from 'react'
import { Link, Route, Switch } from "react-router-dom"

export default class Message extends Component {
	render() {
		return (
			<>
				<Switch>
					<Route path="/message" component={Main} exact/>
					<Route path="/message/:id" component={Discussion}/>
				</Switch>
			</>
		)
	}
}

class Main extends Component {
	render() {
		return (
			<>
				les messages qui utilisent les sockets !
				<Link to="/message/coucou">TU ME VOIS ?</Link>
			</>
		)
	}
}


class Discussion extends Component {
	render() {
		return (
			<>
				Discussion avec l'utilisateur <b>{this.props.match.params.id}</b>
			</>
		)
	}
}