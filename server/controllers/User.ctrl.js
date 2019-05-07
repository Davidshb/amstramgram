const User = require('../models/User')
const bcrypt = require('bcryptjs')
const request = require('request-promise')
const { MailTypes, newMessage, ParseDate } = require('../lib')

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
      .then(user => {
        if (user) {
          res.status(400).end('Ce nom d\'utilisateur est déjà utilisé')
          throw new Error('username utilisé')
        }
        console.log('username OK')
      })
      .then(() => User.findOne({ email: data.email }))
      .then(user => {
        if (user) {
          res.status(400).end('l\'email est utilisé')
          throw new Error('mail déjà utilisé')
        }
        console.log('email OK')
      })
      .then(() => process.env.NODE_ENV === 'production' &&
        request(`https://realemail.expeditedaddons.com/?api_key=${process.env.REALEMAIL_API_KEY}&email=${data.email}&fix_typos=false`)
          .then(body => {
            if (!body.valid) {
              res.status(400).end('l\'email n\'est pas valide')
              throw new Error('mail non valide')
            }
            console.log('email toujours OK')
          })
          .catch(err => console.log('impossible de vérifier le mail') && console.error(err))
      )
      .then(() => bcrypt.hash(data['pwd'][0], 10))
      .then(hash => {
        let obj = {
          username: data.username,
          name: data['fname'],
          familyName: data['lname'],
          password: hash,
          email: data.email,
          birth: ParseDate(data.date)
        }
        return new User(obj).save()
      })
      .then(user => user.authentification())
      .then(user => {
        res.status(200).end(true)
        return {
          confirmation_link: user.token,
          name: user.name,
          Email: user.email
        }
      })
      .then(mailData => process.env.NODE_ENV === 'production' && newMessage(MailTypes.NewUser, mailData))
      .then(() => console.log('--------------------------------\n'))
      .then(async () => {
        await setTimeout(({ username }) => {
          return User
            .findOneAndDelete({ username, emailVerified: false })
            .exec()
            .then(user => {
              if (!user)
                return
              console.log('Utilisateur supprimé \n -----------')
              console.log(user)
              console.log('------------')
            })
        }, 1000 * 60 * 60 * 24, { username: data.username })
      })
      .catch(err => console.error(err))
  },

  getUserData: (req, res, next) => {

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
    console.log(req)
    let { id, isEmail, password, trust } = req.body
    let condition = isEmail ? 'email' : 'username'

    return User
      .findOne({ [condition]: id })
      .exec()
      .then(user => {
        if (!user)
          return res.status(400).end('utilisateur inconnu')

        if (trust)
          user.generateTrustKey()

        return bcrypt.compareSync(password, user.password)
          ? user.authentification()
                .then(user => user.data())
          : res.status(400).end('mot de passe incorrecte')
      })
      .catch(err => res.status(500).end() && console.error(err))
      .finally(next)
  },

  verifyUsername: (req, res, next) => {
    const { username } = req.body
    if (username.length < 3 || username.length > 15)
      return res.status(500).end('Ne touche pas à mon code')

    return User
      .findOne({ username })
      .exec()
      .then(user => res.send(user === null))
      .catch(err => res.status(500).end() && console.error(err))
      .finally(next)
  },

  changeTrustToken: (req, res, next) => {
    //TODO
  }
}
