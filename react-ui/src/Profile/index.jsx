import React from 'react'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { Button } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'
import { setAuthToken, setAutoConnect, url, token } from '../lib/js'
import { removeUser, changeData } from '../redux/user/action'
import { Link } from 'react-router-dom'
import { InputEmail } from '../Modules'
import { Edit, Check, Close } from '@material-ui/icons'
import axios from 'axios'
import { notificationContext } from '../Provider/NotificationProvider'

class Profile extends React.Component {
	#email

	static contextType = notificationContext

	constructor(props) {
		super(props)
		this.logout = this.logout.bind(this)
		this.editEmail = this.editEmail.bind(this)
		this.changeEmail = this.changeEmail.bind(this)
		this.abortChanging = this.abortChanging.bind(this)
		this.errorHandler = this.errorHandler.bind(this)

		this.state = {
			email: props.user.email,
			edition: false
		}
	}

	logout() {
		setAuthToken()
		setAutoConnect(false)
		this.props.removeUser()
		this.props.history.push('/')
	}

	editEmail() {
		this.#email.enable()
		this.setState({ edition: true })
	}

	changeEmail() {
		this.setState({ edition: false })
		this.#email.disable()

		if (this.state.email === this.props.user.email)
			return

		axios.post(`${url}/changeEmail`, { email: this.state.email, token: token() })
				 .then(({ data }) => {
					 if (data === "ok") {
						 this.props.changeData('email', this.state.email)
						 this.props.changeData('emailVerified', false)
					 } else
						 throw new Error("nok")

				 })
				 .catch(err => {
					 this.errorHandler(err)
					 this.setState({ email: this.props.user.email })
				 })
	}

	errorHandler(error) {

	}

	abortChanging() {
		this.setState({ edition: false, email: this.props.user.email })
		this.#email.disable()
	}

	componentDidMount() {
		this.#email.disable()
	}

	render() {
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
							<td>
								<InputEmail changeData={(dataName, dataValue) => this.setState({ [dataName]: dataValue })}
														value={this.state.email} ref={_ => this.#email = _}/>
							</td>
							<td>
								{this.state.edition ?
									<>
										<Button onClick={this.changeEmail}>
											<Check/>
										</Button>
										<Button onClick={this.abortChanging}>
											<Close/>
										</Button>
									</>
									:
									<Button onClick={this.editEmail}>
										<Edit/>
									</Button>
								}
							</td>
						</tr>
						{!this.props.user.emailVerified && <tr>
							<td colSpan="2" style={{ color: "red", paddingLeft: "20px" }}>Votre adresse email n'est pas vérifiée</td>
						</tr>}
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

export default connect(mapStateToProps, { removeUser, changeData })(Profile)
