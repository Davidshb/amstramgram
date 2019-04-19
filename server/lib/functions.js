const User = require('../models/User')

module.exports = {
  ParseDate: date => {
    let tmp = date.substr(6) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
    return new Date(tmp)
  },

  AccountDeleteTimeout: class {
    constructor () {
      this.timer = []
    }

    ajouter (user) {
      let t = setTimeout(() =>
          user.deleteUser()
        , (Math.max(Date.parse(user.creation) + 24 * 60 * 60 * 1000) - Date.now(), 0))

      this.timer.push(t)
    }

    build () {
      return User
        .find({})
        .exec()
        .then(users => {
          console.log('------------\nrestitution des timer et création\n')
          for (let user of users) {
            if (!user.emailVerified) {
              console.log('compte créé le ' + user.creation)
              console.log(' - ' + user.email + ' expire dans ' + new Date(Date.now() - Date.parse(user.creation)).getHours() + ' heures')
              this.ajouter(user)
            }
          }

          console.log('\nfin de la création des timers\n------------')
        })
        .catch(err => console.error(err))
    }
  }
}
