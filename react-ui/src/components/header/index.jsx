import React, {Component} from 'react'
import './index.css'
import { connect } from 'react-redux'
import account from './img_account.png'
import { Link } from 'react-router-dom'

class Header extends Component{
    constructor (props) {
        super(props)
        this.state = {
            inputClass: 'form-control border'
        }

        this.changeTodo = this.changeTodo.bind(this)
        this.key = this.key.bind(this)
    }

     search(event) {
        event.preventDefault()
        if (event.target.search.value === "")
            return;
        event.target.reset()
    }

    key(event) {
        const txt = event.target.value

        if (txt !== "" && this.state.inputClass === 'form-control border')
            this.setState({
                inputClass: this.state.inputClass.concat("border-primary")
            })
        else if(txt === "" && this.state.inputClass !== 'form-control border')
            this.setState({
                inputClass: 'form-control border'
            })

    }

    componentWillMount() {
        this.changeTodo()
    }

    changeTodo() {
        this.setState({
            todo: window.location.pathname === '/inscription' ? 'Se connecter' : "S'inscrire"
        })
    }

    render () {
        return (
            <nav className="navbar navbar-dark bg-dark my__header">
                <Link className="navbar-brand" to="/" onClick={this.changeTodo}>Amstramgram</Link>
                <div className="ml-auto row centered">
                    <form className="navbar-form md-1 col" onSubmit={this.search} autoComplete="off">
                        <div className="form-group">
                            <input type="text" name="search" className={this.state.inputClass} aria-label="search"
                                   placeholder="Recherche..." onKeyUp={this.key}/>
                        </div>
                    </form>

                    <Link to="/inscription" className="img_acc col-auto" onClick={this.changeTodo}>
                        <img src={account} alt="login"/><br/>
                        <span className="span">
                            {this.state.todo}
                        </span>
                    </Link>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.authUser
    }
}

export default connect(mapStateToProps)(Header)