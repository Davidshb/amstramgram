import React, {Component} from 'react'
import connect from 'react-redux/es/connect/connect'
import actions from '../../../redux/actions'
import './style.css'

class Inputs extends Component {
    constructor (props) {
        super(props)

        this.state = {
            username: "",
            usernameProcessing: null
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
    }

    static dateString() {
        return new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()
    }

    componentDidMount () {
        let inputs = document.querySelectorAll("[name='sexe'], #pwd, #pwd2, #email, #date, [name='name']")
        let sex = document.querySelectorAll("[name='sexe']")
        let pwd = document.querySelectorAll('input[type="password"]')
        let reset = document.querySelector('button[type="reset"]')
        let button = document.querySelector("button[type='submit']")

        if (pwd.length !== 2)
            throw Error("touche pas à mon code")

        const changeData = (id, value ) => this.props.changeData(id,value)
        const changeValue = (elem, key, value) => {
            Array.prototype.filter.call(elem, _elem => {
                _elem[key] = _elem[value]
            })
        }

        reset.addEventListener("click", () => {
            changeValue(inputs,"value", "defaultValue")
            changeValue(sex,"checked", "defaultChecked")
            changeValue(pwd,"value", "defaultValue")
            this.setState({
                username: ""
            })
            this.props.deleteData()
        })

        Array.prototype.filter.call(inputs, _input => {
            _input.value = this.props.data[_input.id]
            _input.onChange = (e) => changeData(_input.id,e.target.value)
        })

        Array.prototype.filter.call(sex, _sex => {
            _sex.addEventListener("click", () => {
                changeData("sexe",_sex.value)
            })
        })

        Array.prototype.filter.call(pwd, (_pwd) => _pwd.addEventListener('keypress', () => {
            const changeColor = (color) => {
                pwd[0].style.borderColor = color
                pwd[1].style.borderColor = color
            }
            if (this.props.data.pwd.validity.valid && this.props.data.pwd2.validity.valid &&
                this.props.data.pwd.value === this.props.data.pwd2.value)
                changeColor("#227d41")
            else if (this.props.data.pwd.value.isEmpty() && this.props.data.pwd2.value !== "")
                changeColor("#ced4da")
            else
                changeColor("#FF3C5C")
        }))

        button.addEventListener('click',() => {
            if (this.props.disableButton)
                return

            let data = Object.assign(this.props.data)
            this.props.signUpUser(data)
        })
    }

    usernameChangeHandler (e) {
        e.persist()
        let txt = e.target.value
        txt = txt.slice(1, txt.length)
        if (this.state.usernameProcessing)
            clearTimeout(this.state.usernameProcessing)
        this.setState({
            username: txt
        }, () => {
            if (this.state.username.length < 5)
                return e.target.style.borderColor = "#ced4da"

            const t = setTimeout(() => {
                this.props.verifyUsername(this.state.username, () => {
                    e.target.style.borderColor = this.props.usernameValid ? "#227d41" : "#FF3C5C"
                }, () => {
                    this.setState({usernameProcessing: null})
                })
            }, 3000)

            this.setState({
                usernameProcessing: t
            })
        })
    }

    static usernameClickHandler (e) {
        if (e.target.selectionStart === 0)
            e.target.setSelectionRange(e.target.value.length, e.target.value.length)
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
                            <input type="text" className="form-control" aria-describedby="Tilt" name="name" id="fname"
                                   required placeholder="Prado" minLength="3"/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" aria-describedby="Tilt" name="name" required
                                   placeholder="RASOA..." id="lname" minLength="3"/>
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text w-100 d-block text-center">@Username</span>
                        </div>
                        <div className="input-group col">
                            <input id="username" className="form-control" aria-describedby="Tilt" type="text"
                                   value={'@' + this.state.username} maxLength="16" required
                                   pattern="^@[a-zA-Z0-9_]([a-zA-Z0-9](_{0,2}|[-.]?)){2,15}$"
                                   onChange={this.usernameChangeHandler} onClick={Inputs.usernameClickHandler}
                                   onSelect={Inputs.usernameClickHandler} readOnly={this.props.usernameValidation}
                            />
                            <span className="invalid-feedback">doesn't look good !</span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group form-row">
                            <div className="input-group-prepend col-sm-3">
                                <span className="input-group-text w-100 d-block text-center">Mot de passe</span>
                            </div>
                            <input type="password" className="form-control col" min="8" max="20" id="pwd" required
                                   aria-describedby="psdHelp" placeholder="mot de passe"/>
                            <input type="password" className="form-control col" min="8" max="20" id="pwd2" required
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
                                <input className="custom-control-input" type="radio" id="s1" value="homme"
                                       required name="sexe"/>
                                <label className="custom-control-label" htmlFor="s1">Homme</label>
                            </div>

                            <div className="custom-control custom-radio custom-control-inline">
                                <input className="custom-control-input" type="radio" id="s2" value="femme"
                                       required name="sexe"/>
                                <label className="custom-control-label" htmlFor="s2">Femme</label>
                            </div>
                        </div>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-block text-center w-100">Email</span>
                        </div>
                        <input type="text" className="form-control text-center col" aria-describedby="Tilt" id="email"
                               placeholder="prado-raso@mail.com" required/>
                    </div>

                    <div className="input-group mb-3 form-row">
                        <div className="input-group-prepend col-sm-3">
                            <span className="input-group-text d-inline text-truncate w-100">Date de naissance</span>
                        </div>
                        <input type="date" className="form-control text-center" id="date" required
                       max={Inputs.dateString()}
                        />
                    </div>

                    <br/>
                    <hr/>
                    <small id="Tilt" className="form-text text-muted">
                        Vos données ne sont pas diffusées
                    </small>
                        <button type="submit" className="btn btn-primary btn-lg w-75"
                        disabled={this.props.disableButton}> S'inscrire </button>
                    <button type="reset" className="btn btn-secondary btn-lg w-25">
                        <i className="material-icons">settings_backup_restore</i>
                    </button>
                </div>
            </div>
        )
    }
}

const {changeData, verifyUsername, signUpUser, deleteData} = actions.inscriptionActions
const mapDispatchToProps = {changeData, verifyUsername, signUpUser, deleteData}

export default connect((state) => {return {...state.inscription}}, mapDispatchToProps)(Inputs)