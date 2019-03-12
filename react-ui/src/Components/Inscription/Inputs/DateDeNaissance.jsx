import React from 'react'
import {connect} from "react-redux";
import Cleave from 'cleave.js/react'
import {changeData} from "../../../redux/actions";
import {verifyIsAfterToday} from "../../../lib/js";

class DateDeNaissance extends React.Component {
	state = {
		class: " date-normal"
	}

	dateChangeHandler(e) {
		this.props.changeData('date', e.target.value, () => {
			if (this.props.date.length !== 10) {
				if(this.state.class !== " date-normal")
					this.setState({class: " date-normal"})
				return
			}

			if (verifyIsAfterToday(this.props.date, "DD/MM/YYYY"))
				this.setState({class: " date-incorrect"})
			else
				this.setState({class: " date-correct"})
		})

	}

	render() {
		return (
			<div className="input-group mb-3 form-row">
				<div className="input-group-prepend col-sm-3">
					<span className="input-group-text d-inline text-truncate w-100">Date de naissance</span>
				</div>
				<Cleave options={{date: true}} className={"form-control text-center" + this.state.class} id="date" required
								value={this.props.email}
								placeholder="Entrer une date: JJ/MM/AAAA     "
								onChange={this.dateChangeHandler.bind(this)}
				/>
			</div>
		)
	}
}

export default connect(state => {
	return {date: state.inscription.data.date}
}, {changeData})(DateDeNaissance)