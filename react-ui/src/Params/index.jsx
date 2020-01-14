import React from 'react'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { Button } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'
import { setAuthToken, setAutoConnect, url, NotificationTypes } from '../lib/js'
import { removeUser, changeData } from '../redux/user/action'
import { Link } from 'react-router-dom'
import { InputEmail, InputPasswords } from '../Modules'
import { Edit, Check, Close } from '@material-ui/icons'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { notificationContext } from '../Provider/NotificationProvider'

class Settings extends React.Component {
	#email
	#passwords

	static contextType = notificationContext

	constructor(props, context) {
		super(props, context)
		this.logout = this.logout.bind(this)
		this.edit = this.edit.bind(this)
		this.changeEmail = this.changeEmail.bind(this)
		this.abortChanging = this.abortChanging.bind(this)
		this.errorHandler = this.errorHandler.bind(this)
		this.changeData = this.changeData.bind(this)

		this.state = {
			pwd: ['', ''],
			email: props.user.email,
			emailEdition: 0,
			pwwdEdition: 0
		}
	}

	changeData(dataName, dataValue) {
		this.setState({[dataName]: dataValue})
	}

	logout() {
		setAuthToken()
		setAutoConnect(false)
		this.props.removeUser()
		this.props.history.push('/')
	}

	edit(type) {
		switch (type) {
			case 0: // type email
				this.#email.enable()
				this.setState({emailEdition: 1})
				break
			case 1: // type mot de passe
				this.#passwords.enable()
				this.setState({pwdEdition: 1})
				break
			default:
				throw new Error("wtf wtf wtf")
		}
	}

	changeEmail() {
		if (this.state.email === this.props.user.email)
			return this.abortChanging(0)

		this.setState({edition: 2})
		this.#email.disable()

		return axios.post(`${url}/changeEmail`, {email: this.state.email})
			.then(_ => {
				this.props.changeData('email', this.state.email)
				this.props.changeData('emailVerified', false)
				this.context.addNotification({type: NotificationTypes.NEW_EMAIL_SAVE_SUCCEED})
			})
			.catch(err => {
				this.errorHandler(err)
				this.setState({email: this.props.user.email})
			})
			.finally(_ => this.setState({edition: 0}))
	}

	errorHandler(err) {
		if (!err.response)
			return
		switch (err.response.data) {
			case 'utilisateur inconnu':
				this.context.addNotification({type: NotificationTypes.ERROR, message: 'Veuillez vous reconnecter'})
				return this.logout()
			case 'token expire':
				this.context.addNotification({type: NotificationTypes.ERROR, message: 'Veuillez vous reconnecter'})
				return this.logout()
			case 'token invalide':
				this.context.addNotification({type: NotificationTypes.ERROR, message: 'Veuillez vous reconnecter'})
				return this.logout()
			case 'access unauthorized':
				this.context.addNotification({type: NotificationTypes.ERROR, message: 'ne touche pas à mon code 😡'})
				return this.logout()
			default:
				this.context.addNotification({
					type: NotificationTypes.ERROR,
					message: 'une erreur s\'est produite :('
				})
				break
		}
	}

	/**
	 *
	 * @param type 0 for email and 1 for password
	 */
	abortChanging(type) {
		switch (type) {
			case 0:
				this.setState({emailEdition: 0, email: this.props.user.email})
				this.#email.disable()
				break
			case 1:
				this.setState({pwdEdition: 0, pwd: ['', '']})
				break
			default:
				throw new Error("wtf la variable type contient une valeur qui ne devait pas prendre")
		}
	}

	componentDidMount() {
		this.#email.disable()
		this.#passwords.disable()
	}

	render() {
		let edition = null

		switch (this.state.emailEdition) {
			case 1: // en cours d'édition utilisateur
				edition =
					<>
						<Button onClick={this.changeEmail}>
							<Check/>
						</Button>
						<Button onClick={this.abortChanging}>
							<Close/>
						</Button>
					</>
				break
			case 2: //envoie de la modification
				edition =
					<Button disabled={true}>
						<CircularProgress size={30}/>
					</Button>
				break
			default: //état de départ
				edition =
					<Button onClick={this.editEmail}>
						<Edit/>
					</Button>
		}

		return (
			<>
				<header className="my--header">
					<Link className="navbar-brand" to='/'>Amstramgram</Link>
					<h1 className={styles.h1}>{this.props.user.name + ' ' + this.props.user['familyName']}</h1>
					<div className={styles.logout}>
						<Button variant="contained" color="secondary" onClick={this.logout}>
							<HighlightOff/>
							Se déconnecter
						</Button>
					</div>
				</header>

				<div className={styles.container}>
					<div className={styles.photo}>
						<img src={this.props.user['photo']} alt="profil" width="150px"/>
						<span>{this.props.user.username}</span>
					</div>
					<table className={styles.table}>
						<tbody>
						<tr>
							<td colSpan="5">
								<InputEmail changeData={this.changeData} value={this.state.email} ref={_ => this.#email = _}/>
							</td>
							<td>
								{edition}
							</td>
						</tr>
						{!this.props.user.emailVerified && <tr>
							<td colSpan="6" style={{color: "red", paddingLeft: "20px"}}>Votre adresse email n'est pas vérifiée</td>
						</tr>}
						<tr>
							<td colSpan="5">
								<InputPasswords ref={_ => this.#passwords = _} value={this.state.pwd} changeData={this.changeData}/>
							</td>
							<td>
								{edition}
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</>
		)
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user
	}
}

export default connect(mapStateToProps, {removeUser, changeData})(Settings)
