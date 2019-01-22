import {Inscription} from '../types'
import axios from 'axios'

const url = process.env.NODE_ENV === 'production' ? "/api" : "http://localhost:5000/api"

export function verifyUsername(param, next = () => {}) {
    return (dispatch) => {
        changeData("username",param)
        dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: true})
        axios.post(url + '/verifyUsername', {param}).then((res) => {
            dispatch({type: Inscription.TOGGLE_USERNAME_VALID, usernameValid: res.data})
        })
        .then(() => dispatch({type: Inscription.TOGGLE_USERNAME_PROCESSING, usernameValidation: false}))
        .then(() => next())
    }
}

export function signUpUser (user_data,next = () => {}) {
    return (dispatch) => {
        axios.post(url + '/inscription',user_data).then((res,err)=> {
            console.log(res)
            if(err) {
                console.log(err)
                throw err
            }
            console.log(res.data)
            let user = res.data
            sessionStorage.setItem('Auth', JSON.stringify(user))
            dispatch({type: Inscription.SET_USER, user})
            next()
        })
    }
}

export function changeData (dataName, dataValue, next = () => {}) {
    return (dispatch) => {
        let t = {
            type: Inscription.CHANGE_INSCRIPTION_DATA,
            data: {}
        }

        t.data[dataName] = dataValue

        dispatch(t)
        dispatch({type: Inscription.TOGGLE_INSCRIPTION_BUTTON})
        next()
    }
}

export function deleteData (next = () => {}) {
    return (dispatch) => {
        dispatch({type: Inscription.DELETE_INSCRIPTION_DATA})
        next()
    }
}