import React from 'react'

class Sexe extends React.Component {
  #sexe

  constructor (props) {
    super(props)
    this.sexeHandler = this.sexeHandler.bind(this)
  }

  componentDidMount () {
    this.#sexe = document.getElementsByName('sexe')
  }

  sexeHandler (e) {
    if (!e.target.checked)
      return
    this.props.changeData('sexe', e.target.value)
  }

  render () {
    return (
      <div className="input-group mb-3 form-row">
        <div className="input-group-prepend col-sm-3">
          <span className="input-group-text w-100 d-block text-center">Sexe</span>
        </div>
        <div className="text-center col">
          <div className="custom-control custom-radio custom-control-inline">
            <input className="custom-control-input" type="radio" id="s1" value="homme"
                   required name="sexe" onChange={this.sexeHandler} checked={this.props.value === 'homme'}/>
            <label className="custom-control-label" htmlFor="s1">Homme</label>
          </div>

          <div className="custom-control custom-radio custom-control-inline">
            <input className="custom-control-input" type="radio" id="s2" value="femme"
                   required name="sexe" onChange={this.sexeHandler} checked={this.props.value === 'femme'}/>
            <label className="custom-control-label" htmlFor="s2">Femme</label>
          </div>
        </div>
      </div>
    )
  }
}

export default Sexe
