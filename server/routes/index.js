const user = require('./user')
const article = require('./post')

module.exports = (router) => {
    user(router)
    article(router)
}
