import React, {Component} from 'react'
import { connect } from 'react-redux'
import './index.css'
import {history} from '../../redux/store'
import {SignUpUser} from '../../redux/actions'

class Inscription extends Component {
    constructor (props) {
        super(props)
        if (Object.keys(this.props.user).length)
            history.push('/')

        this.signIn = this.signIn.bind(this)
        this.form = this.form.bind(this)
    }

    async signIn(e) {
        const form = e.target
        e.preventDefault()
        this.props.SignUpUser({
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

    form () {
        window.addEventListener('load', function() {

            let forms = document.getElementsByClassName('needs-validation')

            Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false || form.pwd.value !== form.pwd2.value) {
                        event.preventDefault();
                        event.stopPropagation();
                    }else
                        this.signIn(event)
                    form.classList.add('was-validated');
                }, false)

                Array.prototype.filter.call(form, (_form) => {
                    _form.addEventListener('blur', (e) => {
                        if(_form.name === "pwd")
                            if(_form.value.length < 8 || _form.value.length > 20) {
                                //TODO
                                // doit déclencher l'invalidité de l'input pour que l'utilisateur soit averti
                                // de l'invalidité du contenu rentré
                            }
                    })
                })
            })
        }, false)
    }

    componentDidMount() {
        this.form()
    }

    render() {
        return (
            <div className="container">
                <form className="form-group border p-2 needs-validation" autoComplete="off" onSubmit={null} noValidate>
                    <div className="form-header border col">Inscription</div>
                    <hr/>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text">prénom(s) et Nom</span>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" aria-describedby="Tilt" name="fName" required
                            placeholder="Prado"/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" aria-describedby="Tilt" name="lName" required
                            placeholder="RASO..."/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 d-block text-center">@Username</span>
                        </div>
                        <div className="input-group col">
                            <div className="input-group-prepend">
                                <span className="input-group-text">@</span>
                            </div>
                            <input name="username" className="form-control" aria-describedby="Tilt" type="text"
                               placeholder="nom d'utilisateur" required/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="input-group form-row">
                            <div className="input-group-prepend col-sm-3">
                                <span className="input-group-text w-100 d-block text-center">Mot de passe</span>
                            </div>
                            <input type="password" className="form-control col" min="8" max="20"  name="pwd"
                                   aria-describedby="psdHelp" placeholder="mot de passe" required/>
                            <input type="password" className="form-control col" min="8" max="20"  name="pwd2"
                                   aria-describedby="psdHelp" placeholder="mot de passe" required/>
                        </div>

                        <small id="psdHelp" className="form-text text-muted">
                            Doit être entre 8 et 20 caractères.
                        </small>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 d-block text-center">Sexe</span>
                        </div>

                        <div className="form-check col">
                            <input className="form-check-input" type="radio" name="sexe" id="s1" value="homme"
                                   required/>
                            <label className="form-check-label" htmlFor="s1">Homme</label>
                        </div>

                        <div className="form-check col">
                            <input className="form-check-input" type="radio" name="sexe" id="s2" value="femme"
                                   required/>
                            <label className="form-check-label" htmlFor="s2">Femme</label>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-block text-center w-100">Email</span>
                        </div>
                        <input type="text" className="form-control col" aria-describedby="Tilt" name="email" required
                        placeholder="prado-raso@mail.com"/>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
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