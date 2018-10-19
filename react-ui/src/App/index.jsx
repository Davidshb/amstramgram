import React, {Component} from 'react'
import {connect} from 'react-redux'

class App extends Component {

    render () {
        return (
            <div>

            </div>
        )
    }
}

function MapStateToProps (state) {
    return {
        authUser: state.authUser
    }
}

export default connect(MapStateToProps)(App)
