import { Header } from '../types'

const defaultState = {
  research: '',
  searching: ''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Header.CHANGE_RESEARCH:
      return {
        ...state,
        research: action.research
      }
    case Header.SEARCHING:
      if (action.searching === state.searching)
        return state
      return {
        ...state,
        searching: action.searching
      }
    default:
      return state
  }
}
