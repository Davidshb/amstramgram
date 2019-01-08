import React, {Component} from 'react'
import {connect} from 'react-redux'

class App extends Component {
    constructor (props) {
        super (props)
        if(props.modal === false)
            props.history.replace("/connexion")
    }

    render () {
        return (
            <div>

            </div>
        )
    }
}

function MapStateToProps (state) {
    return {
        ...state.authUser,
        modal: state.common.modalMode
    }
}

export default connect(MapStateToProps)(App)
