import React, {Component} from 'react'
import { connect } from 'react-redux'
import './index.css'

class Inscription extends Component {

    render() {
        return (
            <div className="container">
                <form onSubmit={null} className="form-group border p-2" autoComplete="off">
                    <div className="form-header border">Inscription</div>
                    <hr/>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Nom et prénom(s)</span>
                        </div>
                        <input type="text" className="form-control" aria-describedby="Tilt" name="name" required/>
                        <input type="text" className="form-control" aria-describedby="Tilt" name="name" required/>
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
                        <input type="password" className="form-control"  name="password" aria-describedby="psdHelp"
                               required/>
                        <input type="password" className="form-control"  name="password2" aria-describedby="psdHelp"
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
        isAuth: state.authUser.isAuth
    }
}

export default connect(mapStateToProps)(Inscription)