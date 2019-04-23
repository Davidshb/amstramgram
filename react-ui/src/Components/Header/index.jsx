import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeResearch, toggleSearching } from '../../redux/actions'
import { Link } from 'react-router-dom'
import './style.css'

class Header extends Component {
  constructor (props) {
    super(props)

    props.history.listen(location => this.setState({
        account_img_text: location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
        account_img_link: location.pathname === '/connexion' ? '/inscription' : '/connexion'
      })
    )

    this.state = {
      inputClass: 'form-control border'
    }

    this.onKeyUp = this.onKeyUp.bind(this)
    this.img_search_blur = this.img_search_blur.bind(this)
    this.search = this.search.bind(this)
    this.changeResearchHandler = this.changeResearchHandler.bind(this)
    this.img_search_toggle = this.img_search_toggle.bind(this)
  }

  search (event) {
    event.preventDefault()
    if (this.props.searchValue !== '')
      this.props.history.push('/search/' + this.props.searchValue)
  }

  componentDidMount () {
    let data = sessionStorage.getItem('research-data')
    if (data) this.props.changeResearch(data)
  }

  changeResearchHandler (e) {
    this.props.changeResearch(e.target.value)
    sessionStorage.setItem('research-data', e.target.value)
  }

  onKeyUp (event) {
    const txt = event.target.value

    if (txt !== '' && this.state.inputClass === 'form-control border')
      this.setState({
        inputClass: 'form-control border border-primary'
      })
    else if (txt === '' && this.state.inputClass !== 'form-control border')
      this.setState({
        inputClass: 'form-control border'
      })
  }

  img_search_blur () {
    if (this.props.searchValue === '')
      this.props.toggleSearching(false)
  }

  img_search_toggle () {
    this.props.toggleSearching(true, () => document.querySelector('my__header > input').focus())
  }

  componentWillMount () {
    let tmp = window.location.pathname === '/inscription'
    this.setState({
      account_img_text: tmp ? 'Se connecter' : 'S\'inscrire',
      account_img_link: tmp ? '/connexion' : '/inscription'
    })
  }

  render () {
    return (
      <nav className="navbar navbar-dark bg-dark my--header">
        <Link className=" navbar-brand" to='/'>Amstramgram</Link>
        <div className={' div-recherche ' + this.props.searching}>
          <form onSubmit={this.search}>
            <input type="text" name="search" className={this.state.inputClass} aria-label="search"
                   placeholder="Recherche..." onKeyUp={this.onKeyUp} value={this.props.searchValue}
                   onChange={this.changeResearchHandler}
                   onBlur={this.img_search_blur}/>
          </form>
          <svg className="img-search" onClick={this.img_search_toggle}/>
        </div>

        <Link to={this.state.account_img_link} className="img-acc">
          <svg className="account-img"/>
          <br/>
          <span className="span">{this.state.account_img_text}</span>
        </Link>
      </nav>
    )
  }
}

function mapStateToProps (state) {
  return {
    searchValue: state.header.research,
    searching: state.header.searching
  }
}

export default connect(mapStateToProps, { changeResearch, toggleSearching })(Header)
