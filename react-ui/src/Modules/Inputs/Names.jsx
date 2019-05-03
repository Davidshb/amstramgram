import React from 'react'
import { capitalizeWords, REGEXP_NAMES } from '../../lib/js'

function Names ({ value, changeData }) {
  const onDataChange = (e) => changeData(e.target.id, capitalizeWords(e.target.value))

  return (
    <div className="input-group">
      <span className="label">Noms</span>
      <div className="inputs">
        <input type="text" className="input" name="name" id="fname" required placeholder="Prado" value={value[0]}
               onChange={onDataChange} pattern={REGEXP_NAMES} onBlur={(e) => changeData('fname', e.target.value.trim())}
               autoComplete="given-name"
        />
        <input type="text" className="input" name="name" id="lname" required placeholder="RASOA..." value={value[1]}
               onChange={onDataChange} pattern={REGEXP_NAMES} onBlur={(e) => changeData('lname', e.target.value.trim())}
               autoComplete="family-name"
        />
      </div>
    </div>
  )
}

export default Names
