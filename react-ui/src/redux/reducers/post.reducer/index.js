const initialState = {
    posts: [],
    post: {}
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'LOAD_POSTS':
            return {
                ...state,
                posts: action.posts
            }
        case 'VIEW_POST':
            return {
                ...state,
                post: action.post
            }
        case 'LIKE_OR_UNLIKE_POST':
            let post = Object.assign({},state.post)
            post.likes+=action.l
            return {
                ...state,
                post: post
            }
        case 'ADD_COMMENT':
            console.log("blabla")
            post = Object.assign({},state.post)
            post.comments.push(action.comment)
            return {
                ...state,
                post: post
            }
        default:
            return state
    }
}