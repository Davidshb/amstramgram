import React, {Component} from 'react'
import { connect } from 'react-redux'
import {changeResearch, toggleSearching} from '../../redux/actions/'
import { Link } from 'react-router-dom'
import './style.css'

class Header extends Component{
	constructor (props) {
		super(props)

		let unListen = props.history.listen(location => {
			this.setState({
				account_img_text: location.pathname === '/inscription' ? 'Se connecter' : "S'inscrire",
				account_img_link: location.pathname === '/inscription' ? "/connexion" : '/inscription'
			})
		})

		this.state = {
			inputClass: 'form-control border',
			unListen
		}

		this.key = this.key.bind(this)
		this.img_search_blur = this.img_search_blur.bind(this)
	}

	search(event) { // TODO : lancer une recherche
		event.preventDefault()
		if (event.target.search.value === "")
			return;
		event.target.reset()
	}

	key(event) {
		const txt = event.target.value

		if (txt !== "" && this.state.inputClass === 'form-control border')
			this.setState({
				inputClass: "form-control border border-primary"
			})
		else if(txt === "" && this.state.inputClass !== 'form-control border')
			this.setState({
				inputClass: 'form-control border'
			})
	}

	img_search_blur() {
		if (this.props.searchValue === "")
			this.props.toggleSearching(false);
	}

	componentWillMount() {
		this.setState({
			account_img_text: window.location.pathname === '/inscription' ? 'Se connecter' : "S'inscrire",
			account_img_link: window.location.pathname === '/inscription' ? '/connexion' : '/inscription'
		})
	}

	render () {
		return <nav className="navbar navbar-dark bg-dark my--header">
			<Link className=" navbar-brand" to='/'>Amstramgram</Link>
			<div className={" div-recherche "+ this.props.searching}>
				<input type="text" name="search" className={this.state.inputClass} aria-label="search"
					placeholder="Recherche..." onKeyUp={this.key} value={this.props.searchValue}
					onChange={(e) => this.props.changeResearch(e.target.value)} onSubmit={this.search}
				 	onBlur={this.img_search_blur}/>
				<svg className="img-search" onClick={this.props.toggleSearching}/>
			</div>

			<Link to={this.state.account_img_link} className="img-acc">
				<svg className="account-img"/>
				<br/>
				<span className="span">{this.state.account_img_text}</span>
			</Link>
		</nav>
	}
}

function mapStateToProps(state) {
	return {
		modal: state.common.modalMode,
		searchValue: state.header.research,
		searching: state.header.searching
	}
}

export default connect(mapStateToProps, {changeResearch, toggleSearching} )(Header)