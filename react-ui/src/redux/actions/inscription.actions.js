import {Inscription} from './types'
import axios from 'axios'

const url = process.env.NODE_ENV === 'production' ? "/api" : "http://localhost:5000/api"

export function toggleInscriptionButton(param,next = () => {}) {
    return (dispatch) => {
        dispatch({type: Inscription.TOGGLE_INSTRUCTION_BUTTON, button: param})
        next()
    }
}

export function verifyUsername(param, next = _ => {}) {
   return (dispatch) => {
       dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING,usernameValidation: true})
       axios.post(url + '/verifyUsername',{param}).then((res) => {
           dispatch({type: Inscription.TOGGLE_USERNAME_VALID,usernameValid: res.data})
       })
       .then(() => dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING,usernameValidation: false}))
       .then(() => next())
   }
}