import React from "react";
import {connect} from "react-redux";
import {changeData} from "../../../redux/actions";

class Email extends React.Component {

	constructor(props) {
		super(props)
		console.log(this.email)
	}

	emailChangeHandler() {
		this.props.changeData('email', this.email.value)
	}

	componentDidMount() {
		this.email = document.getElementById('email')
	}

	render() {
		return (
			<div className="input-group mb-3 form-row">
				<div className="input-group-prepend col-sm-3">
					<span className="input-group-text d-block text-center w-100">Email</span>
				</div>
				<input type="email" className="form-control text-center col" aria-describedby="Tilt" id="email"
							 placeholder="prado-raso@mail.com" value={this.props.email} onChange={this.emailChangeHandler.bind(this)}
							 required
				/>
			</div>
		)
	}
}

export default connect(state => {
		return {email: state.inscription.data.email}
	},
	{changeData})(Email)