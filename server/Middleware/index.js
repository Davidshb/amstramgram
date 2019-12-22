const jwt = require("jsonwebtoken")
const User = require('../models/User')

exports.basicAuth = async function (req, res, next) {
	console.log("authentification")
	let authentication = false

	if (req.path === "/connexion") {
		if (req.method === "GET")
			authentication = true
		else
			return next()
	}

	if (!authentication && (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1))
		return res.status(401).end('Missing Authorization Header')

	const token = authentication ? req.query.token : req.headers.authorization.split(' ')[1]
	console.log(token)
	try {
		let decode = jwt.verify(token, process.env.privateKey)
		console.log(decode)
		let user = await User.findById(decode.id).exec().then(user => user).catch(() => res.status(500).end())
		if (!user)
			return !authentication ?
				res.status(401).end('Authorization Header not valid') :
				res.status(400).end('utilisateur inconnu')
		else if (authentication)
			return res.json(user.data())
		req.body.user = user
	} catch (e) {
		return !authentication ?
			res.status(401).end('Authorization Header not valid') : res.status(500).end(e.name === 'TokenExpiredError' ? 'token expire' : 'token invalide')
	}

	next()
}
