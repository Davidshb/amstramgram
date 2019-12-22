const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = {
  ParseDate: date => {
    let tmp = date.substr(6) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
    return new Date(tmp)
  },

  verifyEmail: token => Promise
    .resolve(jwt.verify(token, process.env.privateKey).id)
    .then(decoded => User.findOneAndUpdate({ id: decoded }, { emailVerified: true }))
    .then(doc => !doc ? 0 : doc['username'])
    .catch(() => 1)
}
