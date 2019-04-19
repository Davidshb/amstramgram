import React, { Component } from 'react'
import { capitalizeWords, REGEXP_NAMES } from '../../../lib/js'

class Names extends Component {
  constructor (props) {
    super(props)
    this.onDataChange = this.onDataChange.bind(this)
  }

  onDataChange (e) {
    this.props.changeData(e.target.id, capitalizeWords(e.target.value))
  }

  render () {
    return (
      <div className="mb-2 input-group form-row">
        <div className="input-group-prepend col-sm-3">
          <span className="input-group-text w-100 text-center d-block">Noms</span>
        </div>
        <div className="col">
          <input type="text" className="form-control col to-valid" name="name" id="fname" required
                 placeholder="Prado" value={this.props.value[0]} onChange={this.onDataChange} pattern={REGEXP_NAMES}
                 onBlur={(e) => this.props.changeData('fname', e.target.value.trim())} autoComplete="given-name"
          />
        </div>
        <div className="col">
          <input type="text" className="form-control col to-valid" name="name" id="lname" required
                 placeholder="RASOA..." value={this.props.value[1]} onChange={this.onDataChange} pattern={REGEXP_NAMES}
                 onBlur={(e) => this.props.changeData('lname', e.target.value.trim())} autoComplete="family-name"
          />
        </div>
      </div>
    )
  }
}

export default Names
