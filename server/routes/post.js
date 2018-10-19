const postController = require('../controllers/Post.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()

module.exports = (router) => {
    //liste des posts
    router
        .route('/posts')
        .get(postController.getAll)

    //nouveau post
    router
        .route('/post')
        .post(multipartWare, postController.addPost)

    // liker un post
    router
        .route('/post/like')
        .post(postController.likePost)

    //commenter un post
    router
        .route('/post/comment')
        .post(postController.commentPost)

    //voir un post
    router
        .route('/post/:id')
        .get(postController.getPost)

    router
        .route('/post/unComment')
        .post(postController.removeComment)
}