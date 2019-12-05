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
const routes = require('./routes')

const { tasks, verifyEmail, url, isDev } = require('./lib')
// Multi-process to utilize all CPU cores.

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)
  // Fork workers.

  let numCPUs = require('os').cpus().length
  for (let i = 0; i < numCPUs; i++)
    cluster.fork()

  cluster.on('exit', (worker, code, signal) =>
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
  )

  //TODO : add scheduled works
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
  app.use('/api', router)

  require('mongoose')
    .connect(process.env['MONGODB_URI'], {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('mongodb connected'))
    .catch(error => console.error('can\'t connect to mongodb', error))

  cloudinary.config({
    cloud_name: process.env['CLOUDINARY_NAME'],
    api_key: process.env['CLOUDINARY_API_KEY'],
    api_secret: process.env['CLOUDINARY_SECRET']
  })

  //user account email setting
  app.get('/email-verification', (req, res) =>
    verifyEmail(req.query.token)
      .then(i => res.redirect(`${url}/connexion?p=${i}`))
      .catch(err => {
        if (err.name === 'TokenExpiredError')
          res.redirect(`${url}/connexion?p=1`)
      })
  )

  app.get('/apple-touch-icon-precomposed.png',
    (req, res) => res.sendFile(path.resolve(__dirname, './lib/assets', 'apple-touch-icon-preconposed.png'))
  )

  app.get('apple-touch-icon.png',
    (req, res) => res.sendFile(path.resolve(__dirname, './lib/assets', 'apple-touch-icon.png'))
  )

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html')))

  app.listen(PORT,
    () => console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`)
  )
}
