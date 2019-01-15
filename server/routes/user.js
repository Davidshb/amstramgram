const usercontroller = require('../controllers/User.ctrl')

module.exports = (router) => {

    // avoir un user
    router
        .route('/user/:id')
        .get(usercontroller.getUser)

    //récupérer le profil d'un utilisateur
    router
        .route('/profile/:id')
        .get(usercontroller.getUserProfile)

    //créer un nouveau utilisateur
    router
        .route('/inscription')
        .post(usercontroller.addUser)

    // follow un utilisateur
    router
        .route('/user/follow')
        .post(usercontroller.followUser)

    router
        .route('/connexion')
        .post(usercontroller.login)

    router
        .route('/verifyUsername')
        .post(usercontroller.verifyUsername)
}