import React from 'react'
import { dateIsAfterToday } from '../../lib/js'
import './style.scss'

class DateDeNaissance extends React.Component {

  state = {
    class: ' date-normal'
  }

  handleClass () {
    if (this.props.value.length !== 10) {
      if (this.state.class !== ' date-normal')
        this.setState({ class: ' date-normal' })
    } else if (dateIsAfterToday(this.props.date, 'DD/MM/YYYY'))
      this.setState({ class: ' date-incorrect' })
    else
      this.setState({ class: ' date-correct' })
  }

  dateChangeHandler ({ target }) {
    let value = target.value

    if (value.length > this.props.value.length) {
      if (value.length < 1 || value.length >= 11 || isNaN(value[value.length - 1]))
        return
      if (value.length === 2 || value.length === 5)
        value += '/'
    }

    this.props.changeData('date', value, this.handleClass.bind(this))
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.value === '')
      this.setState({ class: ' date-normal' })
  }

  render () {
    return (
      <div className="input-group">
        <span className="label">Date de naissance</span>
        <input className={'input' + this.state.class} id="date" value={this.props.value}
               placeholder="Entrer une date: JJ/MM/AAAA" onChange={this.dateChangeHandler.bind(this)} required
        />
      </div>
    )
  }
}

export default DateDeNaissance
