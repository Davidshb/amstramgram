import { User } from '../types'

const initialState = {
  user: null,
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
        user: action.user
      }
    case User.FOLLOW_USER:
      let user = Object.assign({}, state.user)
      user['following'].push(action.user_id)
      return {
        ...state,
        user: user
      }
    default:
      return state
  }
}
