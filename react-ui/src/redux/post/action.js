import axios from 'axios'
import {Post} from '../types'

const url = process.env.NODE_ENV === 'production' ? "/api" : "http://localhost:5000/api"

export function loadPosts (_id) {
	return (dispatch) => {
		axios.get(url + '/posts/' + _id)
				 .then((res) => {
					 let posts = res.data
					 dispatch({type: Post.LOAD_POSTS, posts})
				 }).catch(err => console.log(err))
	}
}

export function getPost (_id) {
	return (dispatch) => {
		axios.get(url + '/post/' + _id)
				 .then((res) => {
					 let profile = res.data
					 dispatch({type: Post.VIEW_POST, profile})
				 }).catch(err => console.log(err))
	}
}

export function comment (comment,author_id,post_id) {
	return (dispatch) => {
		axios.post('/post/comment', {
			post_id,
			author_id,
			comment
		})
				 .then(res => {
					 if(res.data === 'Done')
						 dispatch({type: Post.ADD_COMMENT, comment})
				 }).catch(err => console.log(err))
	}
}

export function like (post_id,toLike) {
	return (dispatch) => {
		axios.post(url + '/post/like',{ post_id, like: toLike }).then((res,err) => {
			console.log(err)
			if(res.data === 'Not like')
				return
			dispatch({type: Post.LIKE_POST, l: toLike ? 1 : -1})
		})
	}
}
