const express = require('express')
const path = require('path')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cloudinary = require('cloudinary')
const normalizePort = require('normalize-port')
const routes = require('./routes/')

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  const PORT = normalizePort(process.env.PORT)
  const router = express.Router()
  const URL = process.env.MONGODB_URI

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
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

  // Answer API requests.
  routes(router)
    app.use('/api', router)

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

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
