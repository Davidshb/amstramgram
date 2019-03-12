import React from 'react'
import {connect} from 'react-redux'

class App extends React.Component {
	constructor(props) {
		super(props)
		if (!props.isAuth) {
			props.history.replace('/connexion')
		}
	}

	render() {
		return (
			<div>

			</div>
		)
	}
}

function MapStateToProps(state) {
	return {}
}

export default connect(MapStateToProps, {})(App)
