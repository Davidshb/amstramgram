import React, {Component} from 'react'
import { connect } from 'react-redux'
import './index.css'
import {history} from '../../redux/store'
import {SignUpUser} from '../../redux/actions'

require('moment/locale/fr')


class Inscription extends Component {

    async signIn(e) {
        const form = e.target
        e.preventDefault()
        await this.props.SignUpUser({
            username: form.username.value,
            fName: form.fName.value,
            lName: form.lName.value,
            email: form.email.value,
            pwd: form.pwd.value,
            pwd2: form.pwd2.value,
            birth: new Date(form.date.value)
        },() => {
            if(this.props.user.name)
                history.push('/connexion')
        })
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.signIn.bind(this)} className="form-group border p-2" autoComplete="off">
                    <div className="form-header border">Inscription</div>
                    <hr/>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">prénom(s) et Nom</span>
                        </div>
                        <input type="text" className="form-control" aria-describedby="Tilt" name="fName" required/>
                        <input type="text" className="form-control" aria-describedby="Tilt" name="lName" required/>
                    </div>

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">@</span>
                        </div>
                        <input name="username" className="form-control" aria-describedby="Tilt" type="text"
                               placeholder="nom d'utilisateur" required/>
                    </div>

                    <div className="mb-2">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Mot de passe</span>
                            </div>
                        <input type="password" className="form-control" min="8" max="20"  name="pwd" aria-describedby="psdHelp"
                               required/>
                        <input type="password" className="form-control" min="8" max="20"  name="pwd2" aria-describedby="psdHelp"
                               required/>
                        </div>

                        <small id="psdHelp" className="form-text text-muted">
                            Doit être entre 8 et 20 caractères.
                        </small>
                    </div>

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Email</span>
                        </div>
                        <input type="text" className="form-control" aria-describedby="Tilt" name="email" required/>

                    </div>

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Date d'anniversaire</span>
                        </div>
                        <input type="date" className="form-control" name="date" required/>
                    </div>


                    <br/>
                    <hr/>
                    <small id="Tilt" className="form-text text-muted">
                        Vos données ne sont pas diffusées
                    </small>
                    <button type="submit" className="btn btn-primary btn-lg btn-block">S'inscrire</button>
                </form>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        isAuth: state.authUser.isAuth,
        user: state.authUser.user
    }
}

export default connect(mapStateToProps, {SignUpUser})(Inscription)