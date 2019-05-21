const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = {
  ParseDate: date => {
    let tmp = date.substr(6) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
    return new Date(tmp)
  },

  AccountDeleteTimeout: () => {
    const ajouter = ({ id, email }, ms) => {
      return setTimeout(() => User
          .findOneAndDelete({ id, emailVerified: false })
          .exec()
          .then(doc => doc && console.log('utilisateur supprimé, email non vérifié : ' + email))
          .catch(err => console.error(err))
        , Math.max(ms, 0))
    }

    return User
      .find({ emailVerified: false })
      .exec()
      .then(users => {
        console.log('------------\nrestitution des timer et création\n')
        for (let user of users) {
          console.log('compte créé le ' + user.creation)
          const ms = (Date.now() - user.creation.getTime()),
            expire = 24 - Math.abs(Math.round(ms / (1000 * 60 * 60)))
          console.log(' -- ' + user.email + ' expire dans ' + expire + ' heure(s)')
          ajouter(user.id, 1000 * 24 * 60 * 60 - ms)
        }

        console.log('\nfin de la création des timers\n------------')
      })
      .catch(err => console.error(err))
  },

  verifyEmail: p => Promise
    .resolve(jwt.verify(p, process.env.privateKey).id)
    .then(decoded => User.findOneAndUpdate({ id: decoded }, { emailVerified: true }))
    .then(doc => !doc ? 0 : doc.username)
}
