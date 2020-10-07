import React from 'react'
import { connect } from 'react-redux'
import Slider from '../lib/js/Slider'
import styles from './style.module.scss'
import { Link } from 'react-router-dom'
import { mdiDiscord } from '@mdi/js'
import { Icon } from "@mdi/react"
//import axios from 'axios'
import { Add, HighlightOff, SendRounded as Send } from '@material-ui/icons'
import { Button, Input, TextField } from '@material-ui/core'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			posts: [],
			addPost: false,
			legend: ''
		}

		/*if (props.user) {
		 axios
		 .get('/api/posts')
		 .then(res => this.setState(prevState => ({ posts: prevState.posts.concat(res.data) })))
		 }*/
		this.addPostSubmit = this.addPostSubmit.bind(this)
	}

	addPostSubmit(e) {
		e.preventDefault()
	}

	render() {
		const closeAddPost = e => {
			e.stopPropagation()
			if (e.currentTarget === e.target)
				this.setState({addPost: false})
		}

		if (!this.props.user)
			return <NotConnect/>

		return (
			<div style={{display: "flex", height: "100vh"}}>
				{this.state.addPost &&
				<AddPost close={closeAddPost} dataChanged={(dataName, dataValue) => this.setState({[dataName]: dataValue})}
				         textArea={this.state.legend} file={this.file} submit={this.addPostSubmit}/>}
				<div className={styles["left-side"]}>
					<Link to="/message"><Button type="submit">Messages <b>(2)</b></Button></Link>
				</div>
				<div className={styles.container}>
				</div>
				<div className={styles["right-side"]}>
					{!this.state.addPost &&
					<Button color="primary" variant="contained" onClick={() => this.setState({addPost: true})}>
						<Add/> Ajouter un élément
					</Button>}
				</div>
			</div>
		)
	}
}

class NotConnect extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			test: false
		}
	}

	render() {
		return (
			<div className={styles['not-connect']}>
				{this.state.test ?
					<div className={styles.discord} onMouseOut={() => this.setState({test: false})}>
						<iframe src="https://discordapp.com/widget?id=641376105898573847&theme=dark" width="350" height="500"
						        title="discord" allowTransparency="true" frameBorder="0"/>
					</div> :
					<div className={styles["discord-display"]} onClick={() => this.setState({test: true})}>
						<Icon path={mdiDiscord} size={3} horizontal={true}/>
					</div>
				}
				<Slider/>
				<span>
      Publiez vos photos et réagissez à celles de vos amis ! <br/>
      <Link to="/inscription">Inscrivez-vous dès maintenant !</Link>
    </span>
			</div>
		)
	}
}

function MapStateToProps(state) {
	return {
		user: state.user.user
	}
}

function AddPost(props) {
	return <div className={styles["add-post"]} onClick={props.close}>
		<form action="#" onSubmit={props.submit}>
			<span className={styles["close-button"]}>
				<HighlightOff onClick={props.close} color="secondary" fontSize="large"/>
			</span>
			<header>Ajouter un poste</header>
			<Input type="file" className={styles.file} accept="image/png, image/jpeg" required/>
			<TextField variant="outlined" className={styles.legend} label="légende" value={props.textArea} multiline
			           onChange={e => props.dataChanged('textArea', e.target.value)} rowsMax="9"/>
			<Button className={styles["add-post-submit"]} color="primary" type="submit"
			        fullWidth={false}><Send/> Ajouter</Button>
		</form>
	</div>
}

export default connect(MapStateToProps, {})(App)
