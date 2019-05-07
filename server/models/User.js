const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const PostSchema = require('./Post').prototype.schema

const FollowSchema = new mongoose.Schema({
  _id: false,
  user: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ['PENDING', 'OK', 'SENT', 'BLOCK'],
    default: 'PENDING'
  }
})

const UserSchema = new mongoose.Schema({
  birth: Date,
  email: { type: String, lowercase: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  familyName: { type: String, trim: true },
  followers: [FollowSchema],
  followings: [FollowSchema],
  name: { type: String, trim: true },
  password: String,
  post: [PostSchema],
  private: { type: Boolean, default: false },
  username: { type: String, unique: true },
  creation: { type: Date, default: new Date() },
  token: String,
  trustedToken: { type: String, default: null }
})

UserSchema.methods.follow = async (user_id) => {
  if (this.followings.indexOf(user_id) === -1) {
    this.followings.push(user_id)
    await this.save()
  }
}

UserSchema.methods.addFollower = function (fs) {
  this.followers.push(fs)
  return this.save()
}

UserSchema.methods.data = function () {
  return {
    birth: this.birth,
    familyName: this.familyName,
    followers: this.followers,
    followings: this.followings,
    name: this.name,
    token: this.token,
    trustToken: this.trustToken,
    username: this.username
  }
}

UserSchema.methods.generateTrustKey = function () {
  this.trustToken = jwt.sign({ data: Date.now() }, process.env.privateKey)
  return this.save()
}

UserSchema.methods.createToken = function () {
  this.token = jwt.sign({ data: this._id }, process.env.privateKey, { expiresIn: '24h' })
  return this
    .save()
    .then(() => this)
}

UserSchema.methods.authentification = function (token = null) {
  if (!token)
    return this.createToken()
  console.log(this)
  let res
  try {
    res = jwt.verify(token, process.env.privateKey)
  } catch (e) {
    if (e.name === 'TokenExpiredError')
      return this.createToken()
    else throw e
  }

  if (res.data !== this._id)
    throw new Error('Different users')

  return this
}

module.exports = mongoose.model('User', UserSchema)
