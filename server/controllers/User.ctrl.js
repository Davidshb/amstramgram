const functions = require('../lib/functions')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = {

  addUser: (req, res) => {
    let data = req.body
    if (data.pwd[0] !== data.pwd[1]) {
      return res.status(500).end('password different')
    } else if (data.pwd[0].length < 8)
      return res.status(500).end('password too short')
    console.log('--------------------------------')
    console.log('création d\'un compte')
    console.log(data.lname + " " + data.fname)

    return User
      .findOne({ username: data.username })
      .then(user => {
        if (user) {
          res.status(400).end('usernameUsed')
          throw new Error('username utilisé')
        }
        console.log('username OK')
      })
      .then(() => {
        return User.findOne({ email: data.email }).then(user => {
          if (user) {
            res.status(400).end('emailUsed')
            throw new Error('mail déjà utilisé')
          }
          console.log('email OK')
        })
      })
      .then(() => bcrypt.hash(data.pwd[0], 10))
      .then(hash => {
        let obj = {
          username: data.username,
          name: data.fname,
          familyName: data.lname,
          password: hash,
          email: data.email,
          birth: functions.ParseDate(data.date)
        }

        return new User(obj)
          .save()
          .then(user => user.authentification())
      })
      .then(user => res.status(200).json(user.data()))
      .then(() => console.log("--------------------------------\n"))
      .then(async () => {
        await setTimeout(({ username }) => {
          return User
            .findOneAndDelete({ username, emailVerified: false })
            .exec()
            .then(user => {
              console.log('Utilisateur supprimé \n -------')
              console.log(user)
              console.log('-------')
            })
        }, 1000 * 60 * 60 * 24, { username: data.username })
      })
      .catch(err => console.error(err))
  },

  getUserData: (req, res, next) => {

  },

  // follow un user
  followUser:
    (req, res) => {
      if (req.body.id === req.body.user_id)
        res.status(400).send('tu peux pas te follow')
      User.findById(req.body.id, (err, user) => {
          if (err) return console.error(err)
          user.follow(req.body.user_id)
              .then(() => res.sendStatus(200))
              .catch(err => console.error(err))
        }
      )
    },

  getUserProfile:
    (req, res) =>
      User.findById(req.params.id)
          .exec()
          .then(user => {
            if (!user)
              return res.status(400).end('userUnknow')
          })
          .catch(err => res.status(500).end() && console.error(err))
  ,

  login: (req, res, next) => {
    let { id, type, password } = req.body

  },

  verifyUsername:
    (req, res, next) => {
      User.findOne({ username: req.body.param }, 'username', (err, user) => {
        res.send(user === null)
        next()
      })
    }
}
