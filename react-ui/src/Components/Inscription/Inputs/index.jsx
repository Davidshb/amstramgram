import React, {Component} from 'react'
import connect from 'react-redux/es/connect/connect'
import actions from '../../../redux/actions'
import './style.css'

class Inputs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            usernameProcessing: null
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
        this.form = this.form.bind(this)
        this.form()
    }

    form() {
        window.addEventListener('load', () => {
            let pwd = document.querySelectorAll('input[type="password"]')

            const modify = () => {
                Array.prototype.filter.call(pwd, (_pwd) => {
                    if(pwd[0].value === pwd[1].value && pwd[0].validity.valid && pwd[1].validity.valid)
                        _pwd.style.borderColor = "#227d41"
                    else if(pwd[1].value === "")
                        _pwd.style.borderColor = "#ced4da"
                    else
                        _pwd.style.borderColor = "#FF3C5C"
                })
            }

            Array.prototype.filter.call(pwd, (_pwd) => _pwd.addEventListener('blur', () => modify()))

        },false)
    }

    usernameChangeHandler(e) {
        e.persist()
        let txt = e.target.value
        txt = txt.slice(1,txt.length)
        if(this.state.usernameProcessing)
            clearTimeout(this.state.usernameProcessing)
        this.setState({
            username: txt
        }, () => {
            if(this.state.username.length < 5)
                return //e.target.style.borderColor = "#ced4da"

            const t = setTimeout(() => {
                this.props.verifyUsername(this.state.username,() => {
                    //e.target.style.borderColor = this.props.usernameValid ? "#227d41" : "#FF3C5C"
                }, () => {
                    this.setState({usernameProcessing: null})
                })
            },3000)

            this.setState({
                usernameProcessing: t
            })
        })
    }

    static usernameClickHandler(e) {
        if(e.target.selectionStart === 0)
            e.target.setSelectionRange(e.target.value.length,e.target.value.length)
    }

    render () {
        return (
            <div className="container">
                <div className="form-group border p-2 needs-validation">
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
                            <input name="username" className="form-control" aria-describedby="Tilt" type="text"
                                   value={'@' + this.state.username} maxLength="16"
                                   pattern="^@[a-zA-Z0-9_]([a-zA-Z0-9](_{0,2}|[-.]?)){2,15}$"
                                   onChange={this.usernameChangeHandler} onClick={Inputs.usernameClickHandler} required
                                   disabled={this.props.usernameValidation}
                            />
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
                        <input type="text" className="form-control text-center col" aria-describedby="Tilt" name="email"
                               placeholder="prado-raso@mail.com" required/>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-inline text-truncate w-100">Date de naissance</span>
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
        ...inscription
    }
}

const {verifyUsername, toggleInscriptionButton} = actions.inscriptionActions

export default connect(mapStateToProps, {verifyUsername, toggleInscriptionButton})(Inputs)