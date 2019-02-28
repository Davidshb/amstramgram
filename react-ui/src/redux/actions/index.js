import {Common} from '../types'

export const common = {
    toggleClose: () => {
        return (dispatch) => {
            dispatch({type: Common.TOGGLE_MODAL, modalMode: false})
        }
    },

    toggleOpen: () => {
        return (dispatch) => {
            dispatch({type: Common.TOGGLE_MODAL, modalMode: true})
        }
    }
}

export * from './header.actions'
export * from './post.actions'
export * from './user.actions'
export * from './header.actions'
export * from './inscription.actions'