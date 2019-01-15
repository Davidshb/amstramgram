import React, {Component} from 'react'
import { connect } from "react-redux"
import actions from "../../redux/actions/"
import Inputs from './Inputs/'

class Inscription extends Component {
    constructor (props) {
        super(props)
        if (Object.keys(this.props.isAuth).length)
            this.props.history.push("/")

        this.signIn = this.signIn.bind(this)
    }

    signIn(e) {
        e.preventDefault()
        if(this.props.inscriptionData.length === 0)
            return

        this.props.signUpUser(this.props.inscriptionData,() => {
            if(this.props.isAuth)
                this.props.history.push("/connexion")
        })
    }

    render() {
        return (
            <Inputs/>
        )
    }
}

function mapStateToProps (state) {
    const inscriptionData = state.inscription.inscriptionData
    return {
        inscriptionData,
        isAuth: state.authUser.isAuth,
        user: state.authUser.user
    }
}

const {signUpUser} = actions

export default connect(mapStateToProps, {signUpUser})(Inscription)