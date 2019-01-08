import axios from 'axios'
import {User} from './types'

const url = process.env.NODE_ENV === 'production' ? "/api/" : "http://localhost:5000/api/"

export function getUser (_id) {
    return axios.get(url + 'user/'+ _id)
        .then((res) => {
            return res.data
        }).catch(err => console.log(err))
}

export function getUserProfile (_id) {
    return (dispatch) => {
        axios.get(url + 'profile/' + _id)
            .then((res) => {
                let profile = res.data
                dispatch({type: User.SET_PROFILE, profile})
            }).catch(err => console.log(err))
    }
}

export function signInUser (user_data) {
    return (dispatch) => {
        axios.post(url + 'connexion',user_data).then((res,err)=> {
            console.log(res)
            if(err) {
                console.log(err)
                throw err
            }

            let user = res.data
            sessionStorage.setItem('Auth', JSON.stringify(user))
            dispatch({type: User.SET_USER, user})
        })
    }
}

export function signUpUser (user_data,next = _ => {}) {
    return (dispatch) => {
        axios.post(url + 'inscription',user_data).then((res,err)=> {
            console.log(res)
            if(err) {
                console.log(err)
                throw err
            }
            console.log(res.data)
            let user = res.data
            sessionStorage.setItem('Auth', JSON.stringify(user))
            dispatch({type: User.SET_USER, user})
            next()
        })
    }
}

export function follow (id, user_id) {
    return (dispatch) => {
        axios.post(url + 'user/follow',{ id, user_id }).then((res,err) => {
            if(err)
                throw err
            else
                dispatch({type: User.FOLLOW_USER, user_id})
        }).catch((err)=>console.log(err))
    }
}