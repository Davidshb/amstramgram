import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'

class Header extends React.Component {

  #header

  constructor (props) {
    super(props)

    props.history.listen(location => this.setState({
        account_img_text: location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
        account_img_link: location.pathname === '/connexion' ? '/inscription' : '/connexion',
      })
    )

    this.state = {
      account_img_text: props.history.location.pathname === '/connexion' ? 'S\'inscrire' : 'Se connecter',
      account_img_link: props.history.location.pathname === '/connexion' ? '/inscription' : '/connexion',
      searching: ''
    }

    this.img_search_blur = this.img_search_blur.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.img_search_toggle = this.img_search_toggle.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
  }

  changeSearch () {
    sessionStorage.setItem('research-data', this.search.value)
  }

  searchHandler (e) {
    e.preventDefault()
    if (this.search.value !== '')
      this.props.history.push('/search/' + this.search.value)
  }

  componentDidMount () {
    const data = sessionStorage.getItem('research-data')
    this.#header = document.getElementById('search-input')
    if (data)
      this.search.value = data
  }

  img_search_blur () {
    if (this.search.value === '')
      this.setState({ searching: '' })
  }

  img_search_toggle () {
    this.setState({ searching: 'searching' })
    this.#header.focus()
  }

  render () {
    return (
      <header className="my--header">
        <Link className="navbar-brand" to='/'>Amstramgram</Link>
        <div className={'div-recherche ' + this.state.searching}>
          <form onSubmit={this.searchHandler}>
            <input type="text" name="search" aria-label="search" ref={input => this.search = input}
                   placeholder="Recherche..." id="search-input"
                   onBlur={this.img_search_blur} onChange={this.changeSearch}
            />
          </form>
          <svg className="img-search" onClick={this.img_search_toggle}/>
        </div>

        <Link to={this.state.account_img_link} className="img-acc">
          <svg className="account-img"/>
          <br/>
          <span className="span">{this.state.account_img_text}</span>
        </Link>
      </header>
    )
  }
}

export default Header
