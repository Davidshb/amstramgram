import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import post from './post/reducer'
import user from './user/reducer'
import inscription from './inscription/reducer'
import header from './header/reducer'

//Rassemble des reducers en un seul. Utilisé par le store

export default combineReducers({
	post,
	user,
	inscription,
	header,
	routing: routerReducer
})
