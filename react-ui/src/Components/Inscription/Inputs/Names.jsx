import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {changeData} from "../../../redux/actions"
import {capitalizeWords, REGEXP_NAMES} from "../../../lib/js"

class Names extends Component {
	constructor(props) {
		super(props)

		this.onDataChange = this.onDataChange.bind(this)
	}

	onDataChange(e) {
		this.props.changeData(e.target.id,capitalizeWords(e.target.value))
	}

	render() {
		let fname = this.props.fname
		let lname = this.props.lname

		return (
			<div className="mb-2 input-group form-row">
				<div className="input-group-prepend col-sm-3">
					<span className="input-group-text w-100 text-center d-block">Noms</span>
				</div>
				<div className="col">
					<input type="text" className="form-control col to-valid" name="name" id="fname" required
								 placeholder="Prado" value={fname} onChange={this.onDataChange} pattern={REGEXP_NAMES}
								 onBlur={(e) => this.props.changeData('fname',e.target.value.trim())}
					/>
				</div>
				<div className="col">
					<input type="text" className="form-control col to-valid" name="name" id="lname" required
								 placeholder="RASOA..." value={lname} onChange={this.onDataChange} pattern={REGEXP_NAMES}
								 onBlur={(e) => this.props.changeData('lname',e.target.value.trim())}
					/>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		lname: state.inscription.data.lname,
		fname: state.inscription.data.fname
	}
}

export default connect(mapStateToProps, {changeData})(Names)