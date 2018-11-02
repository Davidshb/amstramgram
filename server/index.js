const express = require('express')
const path = require('path')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cloudinary = require('cloudinary')

// /(([0-2]?[0-9]|3[0-1])\/(0?[13578]|1[02])|([0-2]?[0-9]|30)\/(0?[2469]|11))\/(19[0-9][0-9]|20(0[0-9]|1[0-8]))/gm
// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
  })

} else {
    const app = express()

    //middleware chacal
    app.use(cors())
    app.use(bodyParser.json())
    app.use(helmet())

    const PORT = process.env.PORT
    const router = express.Router()
    const URL = process.env.MONGODB_URI

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
        debugger
    }

  // Priorité les fichiers statics
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')))

  // retourne un 404 si la route n'est pas défini
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
  })

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`)
  })
}
