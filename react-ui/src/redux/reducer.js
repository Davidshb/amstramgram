import { combineReducers } from 'redux';
import post from './reducers/post.reducer';
import authUser from './reducers/authUser.reducer';
import common from './reducers/common.reducer';
import inscription from './reducers/inscription.reducer';
import { routerReducer } from 'react-router-redux';

//Rassemble les reducers en un seul. Le store est créé avec.
export default combineReducers({
    post,
    common,
    authUser,
    inscription,
    routing: routerReducer
});