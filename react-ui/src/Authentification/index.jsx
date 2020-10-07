import React from 'react'
import { setUser } from '../redux/user/action'
import { device, url, api, token, setAuthToken, setAutoConnect } from '../lib/js'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { Link } from "react-router-dom"

class Authentification extends React.Component {

	componentDidMount() {
		let _token = token(), _device = device()
		console.log("je me reloge")
		if (!_token || !_device || _device["auto-connect"] !== "true")
			return this.props.notAuth()
		api.get(`${url}/connexion`, {
			params: {
				token: _token,
				device: _device.id
			}
		})
			.then(({data}) => this.props.setUser(data))
			.then(() => document.getElementById("url").click())
			.catch(err => {
				console.log(err)
				setAuthToken()
				setAutoConnect(false)
				this.props.notAuth()
			})
	}

	render() {
		return (
			<div className={styles.loader}>
				<svg>
					<g>
						<path d="M 50,100 A 1,1 0 0 1 50,0"/>
					</g>
					<g>
						<path d="M 50,75 A 1,1 0 0 0 50,-25"/>
					</g>
					<defs>
						<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" style={{stopColor: '#FF56A1', stopOpacity: 1}}/>
							<stop offset="100%" style={{stopColor: '#FF9350', stopOpacity: 1}}/>
						</linearGradient>
					</defs>
				</svg>
				<p>Chargement</p>
				<Link hidden id="url" to={this.props.url}>lien</Link>
			</div>
		)
	}
}

export default connect(() => ({}), {setUser})(Authentification)
