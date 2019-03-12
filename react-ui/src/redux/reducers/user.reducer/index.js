import {User} from '../../types'

const initialState = {
    user: {
        following: {}
    },
    isAuth: false,
    profile: {}
}

export default (state=initialState,action) => {
    switch (action.type) {
        case User.AUTH:
            return {
                ...state,
                isAuth: action.isAuth
            }
        case User.SET_USER:
            return {
                ...state,
                isAuth: Object.keys(action.user).length > 0,
                user: action.user
            }
        case User.FOLLOW_USER:
            let user = Object.assign({},state.user)
            user.following.push(action.user_id)
            return {
                ...state,
                user
            }
        case User.SET_PROFILE:
            return {
                ...state,
                profile: action.profile
            }
        default:
            return state
    }
}