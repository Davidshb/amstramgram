import React, {Component} from 'react'
import { connect } from "react-redux"
import actions from "../../redux/actions/"
import './style.css'

class Inscription extends Component {
    constructor (props) {
        super(props)
        if (Object.keys(this.props.user).length)
            this.props.history.push("/")

        this.state = {
            username: "",
            usernameProcessing: null
        }

        this.signIn = this.signIn.bind(this)
        this.form = this.form.bind(this)
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this)

        this.form()
    }

    signIn(e) {
        const form = e.target
        e.preventDefault()

        this.props.signUpUser({
            username: form.username.value,
            fName: form.fName.value,
            lName: form.lName.value,
            email: form.email.value,
            pwd: form.pwd.value,
            pwd2: form.pwd2.value,
            birth: new Date(form.date.value)
        },() => {
            if(this.props.user.name)
                this.props.history.push("/connexion")
        })
    }

    form () {
        window.addEventListener("load", () => {

        }, false)
    }

    usernameChangeHandler(e) {
        let txt = e.target.value
        txt = txt.slice(1,txt.length)
        if(this.state.usernameProcessing)
            clearTimeout(this.state.usernameProcessing)
        this.setState({
            username: txt
        }, () => {
            if(this.state.username.length < 5)
                return this.props.toggleInscriptionButton(true)

            const t = setTimeout(() => {
                this.props.verifyUsername(this.state.username,() => {
                    console.log(this.props.usernameValid)
                    if(this.props.usernameValid)
                        this.props.toggleInscriptionButton(false)
                    else
                        this.props.toggleInscriptionButton(true)
                })
            },3000,() => this.setState({usernameProcessing: null}))

            this.setState({
                usernameProcessing: t
            })
        })
    }

    usernameClickHandler(e) {
        if(e.target.selectionStart === 0)
            e.target.setSelectionRange(e.target.value.length,e.target.value.length)
    }

    render() {
        return (
            <div className="container">
                <div className="form-group border p-2 needs-validation" onSubmit={null}>
                    <div className="form-header border col">Inscription</div>
                    <hr/>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 text-center d-block">Noms</span>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" aria-describedby="Tilt" name="fName" id="fName"
                            required placeholder="Prado"/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" aria-describedby="Tilt" name="lName" required
                            placeholder="RASO..." id="lName"/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 d-block text-center">@Username</span>
                        </div>
                        <div className="input-group col">
                            <input name="username" className={"form-control"} aria-describedby="Tilt" type="text"
                               placeholder="nom d'utilisateur" value={'@' + this.state.username} maxLength="16"
                               pattern="^@[a-zA-Z0-9_]([a-zA-Z0-9](_{0,2}|[-.]?)){2,15}$"
                               onChange={this.usernameChangeHandler} onClick={this.usernameClickHandler} required/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group form-row">
                            <div className="input-group-prepend col-sm-3">
                                <span className="input-group-text w-100 d-block text-center">Mot de passe</span>
                            </div>
                            <input type="password" className="form-control col" min="8" max="20"  name="pwd" required
                                   aria-describedby="psdHelp" placeholder="mot de passe"/>
                            <input type="password" className="form-control col" min="8" max="20"  name="pwd2" required
                                   aria-describedby="psdHelp" placeholder="mot de passe"/>
                        </div>

                        <small id="psdHelp" className="form-text text-muted">
                            Doit être entre 8 et 20 caractères.
                        </small>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 d-block text-center">Sexe</span>
                        </div>
                        <div className="text-center col">
                            <div className="custom-control custom-radio custom-control-inline">
                                <input className="custom-control-input" type="radio" name="sexe" id="s1" value="homme"
                                       required/>
                                <label className="custom-control-label" htmlFor="s1">Homme</label>
                            </div>

                            <div className="custom-control custom-radio custom-control-inline">
                                <input className="custom-control-input" type="radio" name="sexe" id="s2" value="femme"
                                       required/>
                                <label className="custom-control-label" htmlFor="s2">Femme</label>
                            </div>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-block text-center w-100">Email</span>
                        </div>
                        <input type="text" className="form-control text-center col" aria-describedby="Tilt" name="email" required
                        placeholder="prado-raso@mail.com"/>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-inline text-truncate">Date de naissance</span>
                        </div>
                        <input type="date" className="form-control text-center" name="date" required/>
                    </div>


                    <br/>
                    <hr/>
                    <small id="Tilt" className="form-text text-muted">
                        Vos données ne sont pas diffusées
                    </small>
                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={this.props.button}>
                        S'inscrire
                    </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    const inscription = state.inscription
    return {
        isAuth: state.authUser.isAuth,
        user: state.authUser.user,
        ...inscription
    }
}

const {signUpUser, inscriptionActions} = actions

export default connect(mapStateToProps, {signUpUser, ...inscriptionActions})(Inscription)