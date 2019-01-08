import * as userActions from './user.actions'
import * as postActions from './post.actions'
import * as inscriptionActions from './inscription.actions'
import {Common} from './types'

const common = {
    toggleClose: () => {
        return (dispatch) => {
            dispatch({type: Common.TOGGLE_MODAL, modalMode: false})
        }
    },

    toggleOpen: () => {
        return (dispatch) => {
            dispatch({type: Common.TOGGLE_MODAL, modalMode: true})
        }
    },

    changeResearch: (newResearch) => {
        return (dispatch) => {
            dispatch({type: Common.CHANGE_RESEARCH, research: newResearch})
        }
    }
}

export default  {...userActions, ...postActions, ...common, inscriptionActions}