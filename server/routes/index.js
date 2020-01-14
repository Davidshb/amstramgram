const user = require('./user')
const article = require('./post')
const { basicAuth } = require("../Middleware/index")

module.exports = router => {
	router.use(basicAuth)
	user(router)
	article(router)
}
