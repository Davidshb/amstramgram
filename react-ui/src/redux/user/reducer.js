import {token} from "../../lib/js";
import {User} from "../types";

const initialState = {
	user: token(),
	error: null,
	profile: {}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case User.SET_PROFILE:
			return {
				...state,
				profile: action.profile
			}
		case User.SET_USER:
			return {
				...state,
				isAuth: Object.keys(action.user).length > 0,
				user: action.token
			}
		case User.FOLLOW_USER:
			let user = Object.assign({}, state.user)
			user['following'].push(action.user_id)
			return {
				...state,
				user: action.token
			}
		case User.ERROR:
			return {
				...state,
				error: action.error
			}
		default:
			return state
	}
}
