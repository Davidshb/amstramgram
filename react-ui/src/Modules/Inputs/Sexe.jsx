import React from 'react'

export default function Sexe ({ changeData, value }) {

  function sexeHandler (e) {
    if (!e.target.checked)
      return
    changeData('sexe', e.target.value)
  }

  return (
    <div className="input-group">
      <span className="label">Sexe</span>
      <div className="radios">
        <div className="radio">
          <input type="radio" id="s1" value="homme"
                 required name="sexe" onChange={sexeHandler} checked={value === 'homme'}/>
          <label htmlFor="s1">Homme</label>
        </div>

        <div className="radio">
          <input type="radio" id="s2" value="femme"
                 required name="sexe" onChange={sexeHandler} checked={value === 'femme'}/>
          <label htmlFor="s2">Femme</label>
        </div>
      </div>
    </div>
  )
}
