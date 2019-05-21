const User = require('../models/User')
const Device = require('../models/Device')
const bcrypt = require('bcryptjs')
const request = require('request-promise')
const { MailTypes, newMessage, ParseDate, isDev } = require('../lib')
const jwt = require('jsonwebtoken')

module.exports = {

  addUser: (req, res) => {
    let data = req.body
    if (data['pwd'][0] !== data['pwd'][1])
      return res.status(400).end('Les mots de passes sont différents')
    else if (data['pwd'][0].length < 8)
      return res.status(400).end('Le mot de passe est trop court')

    console.log('--------------------------------')
    console.log('création d\'un compte')
    console.log(`${data['lname']} ${data['fname']}`)

    return User
      .findOne({ username: data.username })
      .exec()
      .then(user => {
        if (user) {
          res.status(400).end('Ce nom d\'utilisateur est déjà utilisé')
          return Promise.reject('username utilisé')
        }
        console.log('username OK')
        return Promise.resolve()
      })
      .then(() => User.findOne({ email: data.email }))
      .then(user => {
        if (user) {
          res.status(400).end('l\'email est utilisé')
          return Promise.reject('mail déjà utilisé')
        }
        console.log('email OK')
      })
      .then(() => !isDev && request({
          uri: `https://realemail.expeditedaddons.com/`,
          qs: {
            api_key: process.env['REALEMAIL_API_KEY'],
            email: data.email,
            fix_typos: false
          },
          headers: {
            'User-Agent': 'Request-Promise'
          },
          json: true
        })
          .then(body => {
            if (!body.valid) {
              res.status(400).end('l\'email n\'est pas valide')
              return Promise.reject('mail non valide')
            }
            console.log('email toujours OK')
          })
          .catch(err => console.log('impossible de vérifier le mail') && console.error(err))
      )
      .then(() => bcrypt.hash(data['pwd'][0], bcrypt.genSaltSync(10)))
      .then(hash => {
        let obj = {
          username: data.username,
          name: data['fname'],
          familyName: data['lname'],
          password: hash,
          email: data.email,
          birth: ParseDate(data.date)
        }

        let user = new User(obj)
        user.token = jwt.sign({ id: user.id }, process.env.privateKey, { expiresIn: '24h' })
        return user.save()
      })
      .then(user => {
        res.status(200).end('true')
        return {
          confirmation_link: user.token,
          name: user.name,
          Email: user.email
        }
      })
      .then(mailData => !isDev && newMessage(MailTypes.NewUser, mailData))
      .then(() => console.log('--------------------------------\n'))
      .then(() =>
        setTimeout(({ username }) => User
            .findOneAndDelete({ username, emailVerified: false })
            .exec()
            .then(user => {
              if (!user)
                return
              console.log('Utilisateur supprimé \n -----------')
              console.log(user)
              console.log('------------')
            })
          , 1000 * 60 * 60 * 24, { username: data.username })
      )
      .catch(err => res.status(500).end() && console.error(err))
  },

  // follow un user
  followUser: (req, res, next) => {
    if (req.body.id === req.body['user_id'])
      return res.status(400).end('tu ne peux pas te follow')

    return User
      .findById(req.body.id)
      .exec()
      .then(user => user.follow(req.body['user_id']))
      .then(() => res.sendStatus(200))
      .catch(err => console.error(err))
      .finally(next)
  },

  //TODO : à terminer dans les cas où un profil est bloqué
  getUserProfile: (req, res, next) => User
    .findById(req.params.id)
    .exec()
    .then(user => {
      if (!user)
        return res.status(400).end('utilisateur inconnu')
      res.json(user.data())
    })
    .catch(err => res.status(500).end() && console.error(err))
    .finally(next),

  login: (req, res, next) => {
    let { id, isEmail, password, trusted, device } = req.body
    const condition = isEmail ? 'email' : 'username'
    console.log('--------\nconnexion')
    return User
      .findOne({ [condition]: id })
      .exec()
      .then(user => {
        if (!user) {
          res.status(400).end('utilisateur inconnu')
          return Promise.reject('utilisateur inconnu')
        }
        console.log('utilisateur : ' + user.email)
        return user
          .trust(device, req.useragent, trusted)
          .then(_device => device = _device)
          .then(() => user)
      })
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          console.log('mot de passe OK')
          try {
            jwt.decode(user.token, process.env.privateKey)
          } catch (e) {
            user.token = jwt.sign({ id: user.id }, process.env.privateKey, { expiresIn: '24h' })
          }
          return user
            .save()
            .then(user => user.data())
        } else {
          console.log('mot de passe pas bon')
          res.status(400).end('mot de passe incorrecte')
          return Promise.reject('incorrect password')
        }
      })
      .then(data => res.json({ ...data, device }))
      .then(next)
      .catch(err => res.status(500).end() && console.error(err))
  },

  auth: (req, res, next) => {
    let { token, device } = req.query,
      decode

    if (device)
      device = JSON.parse(device)
    try {
      decode = jwt.verify(token, process.env.privateKey)
    } catch (e) {
      console.log(e.name)
      if (!device || !device.trusted) {
        console.log('mauvais token')
        return res
          .status(400)
          .end(e.name === 'TokenExpiredError' ? 'token expire' : 'token invalide')
      }
      return Device
        .findById(device.id)
        .exec()
        .then(_device => {
          if (!_device) {
            res.status(400).end('device introuvable')
            return Promise.reject('device introuvable')
          }
          if (!_device.trusted) {
            res.status(400).end('token invalide')
            return Promise.reject('token invalide')
          }
          return _device.user
        })
        .then(userId => User
          .findById(userId)
          .exec()
          .then(user => {
            if (!user)
              return Promise.reject()

            try {
              jwt.verify(user.token, process.env.privateKey)
            } catch (e) {
              user.token = jwt.sign({ id: user.id }, process.env.privateKey, { expiresIn: '24h' })
            }

            return user
              .save()
              .then(() => res.json(user.data()))
          }))
        .catch(err => res.status(500).end() && console.error(err))
    }
    return User
      .findById(decode['id'])
      .exec()
      .then(user => {
        if (!user) {
          res.status(400).end('utilisateur inconnu')
          return Promise.reject('utilisateur inconnu')
        }
        res.json(user.data())
      })
      .then(next)
      .catch(err => res.status(500).end() && console.error(err))
  },

  verifyUsername: (req, res, next) => {
    const { username } = req.body
    if (username.length < 3 || username.length > 15)
      return res.status(500).end('Ne touche pas à mon code')

    return User
      .findOne({ username })
      .exec()
      .then(user => res.send(user === null))
      .then(next)
      .catch(err => res.status(500).end() && console.error(err))
  }
}
