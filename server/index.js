const express = require('express')
const app = express()
const path = require('path')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const cloudinary = require('cloudinary')
const router = express.Router()
const PORT = require('normalize-port')(process.env.PORT)
//const PORT = require('normalize-port')(5000)
const routes = require('./routes')
const { basicAuth } = require("./Middleware")

const { verifyEmail, url, isDev } = require('./lib')
// Multi-process to utilize all CPU cores.

if (isDev) {
	process.env.MONGODB_URI = 'mongodb://localhost:27017/amstramgram'
	process.env.privateKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCqAm6QkdYC/WETPur2v9NHk/6XvbXQcNJRslvukajBSi8d8B/8m' +
		'VxJXUGWY7ZEEkFSgB2Ly8VzYvbchESDAer4l5Ac2dPEUr7JRKgFmR+BOcXXJAQsPDpbJvO7rnYLAAHMsvHqNNbhSls7SJ6rSYzP53sWBa3ga27XC' +
		'mb+fAzy/H/bVcHBonlWPvgVvMjQjqC/E8TpXYoqrNrORfkLgluHj/0cuhTi3Aq6n/AdNFTeflyd/jKLFUaVugEr1Ad438rzRTfK5VCjGrt/UwrLA' +
		'XkiotWNw1UbFimMU/aHWlwI441UgaVB4h9iYhMgJGdD3wDLjvMKNSLrL0PPuQzCyxrgOM6YjurAYjkSxdrnlaHpnJeHcuHTlFlsnK/B9pKroVCl0' +
		'B+eNwEsvviHEv6w2VQwY/N2PZIEI8wEqH25LpwlkSHswG1kAdZowKb6qYrBkPOK/U0EQccZlFdmvrfExMX5Y17qpGhKsthz4LQrCRDBuxtsFAbUY' +
		'KlbgRRF0wFHkDYr5zJVaNz1sfSSUORD/m7z5k1u2l4ajoRc3DyEmEiDW6hhr5ubzZMgAXMvmJOw68B16VtPf6buY1hujgVwTXDUGB/XyriIh884m' +
		'lSXD53lkyKswl8wGmmqkd15In6xBDVL+JrYuLOL7eBVwdTvUJ7LUg+h2y3++mrd7Jq0pNMoCQ== 34123756+Davidshb@users.noreply.gith' +
		'ub.com'
}

if (!isDev && cluster.isMaster) {
	console.error(`Node cluster master ${process.pid} is running`)
	// Fork workers.

	let numCPUs = require('os').cpus().length
	for (let i = 0; i < numCPUs; i++)
		cluster.fork()

	cluster.on('exit', (worker, code, signal) =>
		console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
	)

} else {
	// Priority serve any static files.
	app.use(require('cors')())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(require('helmet')())
	app.use(compression())
	app.use(require('express-useragent').express())
	app.use(express.static(path.resolve(__dirname, '../react-ui/build')))

	app.use(morgan(isDev ? 'dev' : 'common'))

	// Answer client requests.
	routes(router)
	router.use(basicAuth)
	app.use('/api', router)

	require('mongoose')
		.connect(process.env['MONGODB_URI'], {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		})
		.then(() => console.log('mongodb connected'))
		.catch(error => console.error('can\'t connect to mongodb', error))

	/* cloudinary.config({
		 cloud_name: process.env['CLOUDINARY_NAME'],
		 api_key: process.env['CLOUDINARY_API_KEY'],
		 api_secret: process.env['CLOUDINARY_SECRET']
	 })*/

	//user account email setting
	app.get('/email-verification', (req, res) => verifyEmail(req.query.token)
		.then(username => res.end(`/connexion?p=${username}`))
		.catch(err => res.end(`/connexion?p=${err.name === 'TokenExpiredError' ? 1 : 0}`))
	)

	app.get('/apple-touch-icon-precomposed.png',
		(req, res) => res.sendFile(path.resolve(__dirname, './lib/assets', 'apple-touch-icon-precomposed.png'))
	)

	app.get('apple-touch-icon.png',
		(req, res) => res.sendFile(path.resolve(__dirname, './lib/assets', 'apple-touch-icon.png'))
	)

	// All remaining requests return the React app, so it can handle routing.
	app.get('*', (request, response) => response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html')))

	app.use((err, req, res, next) => {
		if(err)
			console.error(err.stack)

		next()
	})

	app.listen(PORT,
		() => console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`)
	)
}
