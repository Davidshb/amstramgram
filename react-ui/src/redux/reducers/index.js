import { combineReducers } from 'redux';
import post from './post.reducer';
import authUser from './authUser.reducer';
import common from './common.reducer';
import inscription from './inscription.reducer';
import header from './header.reducer';
import {routerReducer} from 'react-router-redux';

//Rassemble les reducers en un seul. Le store est créé avec.
export default combineReducers({
    post,
    common,
    authUser,
    inscription,
    header,
    routing: routerReducer
});