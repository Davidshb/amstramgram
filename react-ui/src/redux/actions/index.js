import axios from 'axios'

const url = process.env.NODE_ENV === 'production' ? "/api/" : "http://localhost:5000/api/"

export function loadPost (_id) {
    return (dispatch) => {
        axios.get(url + 'posts/' + _id)
            .then((res) => {
                let posts = res.data
                dispatch({type:'LOAD_ARTICLES', posts})
            }).catch(err => console.log(err))
    }
}

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
                dispatch({type: 'SET_PROFILE', profile})
            }).catch(err => console.log(err))
    }
}

export function getPost (_id) {
    return (dispatch) => {
        axios.get(url + 'post/' + _id)
            .then((res) => {
                let profile = res.data
                dispatch({type: 'VIEW_POST', profile})
            }).catch(err => console.log(err))
    }
}

export function comment (comment,author_id,post_id) {
    return (dispatch) => {
        axios.post('post/comment', {
            post_id,
            author_id,
            comment
        })
            .then(res => {
                if(res.data === 'Done')
                    dispatch({type: 'ADD_COMMENT', comment})
            }).catch(err => console.log(err))
    }
}

export function like (post_id,toLike) {
    return (dispatch) => {
        axios.post(url + 'post/like',{ post_id, like: toLike }).then((res) => {
            if(res.data === 'Not like')
                return
            dispatch({type:'LIKE_OR_UNLIKE_POST', l: toLike ? 1 : -1})
        }).catch((err)=>console.log(err))
    }
}

export function follow (id, user_id) {
    return (dispatch) => {
        axios.post(url + 'user/follow',{ id, user_id }).then((res) => {
            dispatch({type:'FOLLOW_USER', user_id})
        }).catch((err)=>console.log(err))
    }
}

export function SignInUser (user_data) {
    return (dispatch) => {
        axios.post(url + 'connexion',user_data).then((res)=> {
            let user = res.data
            sessionStorage.setItem('Auth', JSON.stringify(user))
            dispatch({type: 'SET_USER', user})
        }).catch((err)=>console.log(err))
    }
}

export function toggleClose() {
    return (dispatch) => {
        dispatch({type: 'TOGGLE_MODAL', modalMode: false})
    }
}

export function toggleOpen() {
    return (dispatch) => {
        dispatch({type: 'TOGGLE_MODAL', modalMode: true})
    }
}