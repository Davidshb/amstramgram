import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import post from './post/reducer'
import user from './user/reducer'

//Rassemble des reducers en un seul. Utilisé par le store

export default combineReducers({
  post,
  user,
  routing: routerReducer
})
