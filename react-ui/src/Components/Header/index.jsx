import React, {Component} from 'react'
import { connect } from 'react-redux'
import actions from '../../redux/actions/'
import account from './img_account.png'
import { Link } from 'react-router-dom'
import './style.css'

class Header extends Component{
    constructor (props) {
        super(props)

        this.state = {
            inputClass: 'form-control border',
            unListen: props.history.listen(location => {
                this.setState({
                    todo: location.pathname === '/inscription' ? 'Se connecter' : "S'inscrire",
                    to: location.pathname === '/inscription' ? "/connexion" : '/inscription'
                })
            })
        }

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
        this.setState({
            todo: window.location.pathname === '/inscription' ? 'Se connecter' : "S'inscrire",
            to: window.location.pathname === '/inscription' ? '/connexion' : '/inscription'
        })
    }

    render () {
        return (
            <nav className="navbar navbar-dark bg-dark my__header">
                <Link className="navbar-brand" to='/'>Amstramgram</Link>
                <div className="ml-auto row centered">
                    <form className="navbar-form md-1 col" onSubmit={this.search} autoComplete="off">
                        <div className="form-group">
                            <input type="text" name="search" className={this.state.inputClass} aria-label="search"
                                   placeholder="Recherche..." onKeyUp={this.key} value={this.props.searchValue}
                                   onChange={(e) => this.props.changeResearch(e.target.value)}/>
                        </div>
                    </form>

                    <Link to={this.state.to}
                          className="img_acc col-auto">
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
        modal: state.common.modalMode,
        searchValue: state.common.research
    }
}

let {changeResearch} = actions

export default connect(mapStateToProps, {changeResearch} )(Header)