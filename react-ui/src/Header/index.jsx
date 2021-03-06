import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { connect } from 'react-redux'
import { device, NotificationTypes, setAuthToken, token, url } from '../lib/js'
import { setUser } from '../redux/user/action'
import axios from 'axios'
import { notificationContext } from '../Provider/NotificationProvider'

class Header extends React.Component {

	static contextType = notificationContext

	constructor(props, context) {
		super(props, context)
		this.img_search_blur = this.img_search_blur.bind(this)
		this.searchHandler = this.searchHandler.bind(this)
		this.img_search_toggle = this.img_search_toggle.bind(this)
		this.changeSearch = this.changeSearch.bind(this)

		this.state = {
			account_img_text: 'Chargement...',
			account_img_link: '#',
			searching: ''
		}

		const _token = token()
		const _device = device()
		if ((_token || (_device && _device.trusted)) && !this.props.user) {
			axios.get(`${url}/connexion`, {params: {token: _token, device: _device && _device.id}})
				.then(({data}) => props.setUser(data))
				.catch(err => this.errorHandler(err))
		}

		if (this.props.user) {
			this.state = {
				account_img_text: this.props.user.username,
				account_img_link: `/settings`
			}
			return
		}

		this.listener = props.history.listen(location => this.setState({
				account_img_text: location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
				account_img_link: location.pathname === '/connexion' ? '/inscription' : '/connexion'
			})
		)

		this.state = {
			account_img_text: props.history.location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
			account_img_link: props.history.location.pathname === '/connexion' ? '/inscription' : '/connexion'
		}
	}

	errorHandler(err) {
		if (err.response) {
			setAuthToken()
			switch (err.response.data) {
				case 'token expire':
					this.props.history.push('/connexion', {message: 'veuillez vous authentifiez'})
					break
				case 'token invalide':
					this.props.history.push('/connexion', {message: 'veuillez vous authentifiez'})
					break
				case 'device introuvable':
					this.props.history.push('/connexion')
					break
				case 'utilisateur inconnu':
					this.props.history.push('/connexion')
					break
				default:
					this.context.addNotification({
						type: NotificationTypes.ERROR,
						message: 'erreur Serveur :('
					})
					break
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevProps.user && this.props.user) {
			if (this.listener)
				this.listener()
			this.setState({
				account_img_text: this.props.user.username,
				account_img_link: `/settings`
			})
		}

		if (prevProps.user && !this.props.user) {
			this.listener = this.props.history.listen(location => this.setState({
					account_img_text: location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
					account_img_link: location.pathname === '/connexion' ? '/inscription' : '/connexion'
				})
			)

			this.setState({
				account_img_text: 'Se connecter',
				account_img_link: '/connexion',
				searching: ''
			})
		}
	}

	changeSearch() {
		sessionStorage.setItem('research-data', this.search.value)
	}

	searchHandler(e) {
		e.preventDefault()
		if (this.search.value !== '')
			this.props.history.push('/search/' + this.search.value + '/')
	}

	componentDidMount() {
		const data = sessionStorage.getItem('research-data')
		if (data)
			this.search.value = data
	}

	componentWillUnmount() {
		if (this.listener)
			this.listener()
	}

	img_search_blur() {
		if (this.search.value === '')
			this.setState({searching: ''})
	}

	img_search_toggle() {
		this.setState({searching: 'searching'})
		setTimeout(() => this.search.focus(), 500)
	}

	render() {
		return (
			<header className="my--header">
				<Link className="navbar-brand" to='/'>Amstramgram</Link>
				<div className={'div-recherche ' + this.state.searching}>
					<form onSubmit={this.searchHandler}>
						<input type="text" name="search" aria-label="search" ref={input => this.search = input}
						       placeholder="Recherche..." id="search-input"
						       onBlur={this.img_search_blur} onChange={this.changeSearch}
						/>
					</form>
					<svg className="img-search" onClick={this.img_search_toggle}/>
				</div>

				<Link to={this.state.account_img_link} className="img-acc">
					<svg className="account-img"/>
					<br/>
					<span className="span">{this.state.account_img_text}</span>
				</Link>
			</header>
		)
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user
	}
}

export default connect(mapStateToProps, {setUser})(Header)
