import React, {Component} from 'react'
import { connect } from "react-redux"
import {signUpUser} from "../../redux/actions/"
import Inputs from './Inputs/'

class Inscription extends Component {
    constructor (props) {
        super(props)
        if (this.props.isAuth)
            this.props.history.push("/")
    }

    render() {
        return (
            <Inputs/>
        )
    }
}

function mapStateToProps (state) {
    return {
        isAuth: state.authUser.isAuth,
        user: state.authUser.user
    }
}

export default connect(mapStateToProps, {signUpUser})(Inscription)