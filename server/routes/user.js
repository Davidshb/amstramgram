const userController = require('../controllers/User.ctrl')

module.exports =  (router) => {

    // avoir un user
    router
        .route('/user/:id')
        .get(userController.getUser)

    //récupérer le profil d'un utilisateur
    router
        .route('/profile/:id')
        .get(userController.getUserProfile)

    //créer un nouveau utilisateur
    router
        .route('/inscription')
        .post(userController.addUser)

    // follow un utilisateur
    router
        .route('/user/follow')
        .post(userController.followUser)

    router
        .route('/connexion')
        .post(userController.login)

    router
        .route('/verifyUsername')
        .post(userController.verifyUsername)
}