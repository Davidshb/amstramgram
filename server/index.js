const express = require('express')
const path = require('path')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cloudinary = require('cloudinary')
const normalizePort = require('normalize-port')

const isDev = process.env.NODE_ENV !== 'production';
// /(([0-2]?[0-9]|3[0-1])\/(0?[13578]|1[02])|([0-2]?[0-9]|30)\/(0?[2469]|11))\/(19[0-9][0-9]|20(0[0-9]|1[0-8]))/gm
// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
  })

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const app = express()
    const PORT = normalizePort(process.env.PORT)
    const router = express.Router()
    const URL = process.env.MONGODB_URI

    //middleware chacal
    app.use(cors())
    app.use(bodyParser.json())
    app.use(helmet())
    app.use(compression())

    if(isDev)
        app.use(morgan('dev'))
    else {
        app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
        app.use(morgan('common'))
    }

    // Priorité les fichiers statics

    routes(router)
    app.use('/api', router)

      // configuration cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    })

    try {
         mongoose.connect(URL, {
             useNewUrlParser: true,
             useCreateIndex: true
        })
    } catch (error) {
        console.error("can't connect to mongodb")
    }

  // retourne la page de base si on essaie d'accéder à une page qui n'existe pas
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
  })

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`)
  })
}
