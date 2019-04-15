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
  token: String
})

UserSchema.methods.follow = async (user_id) => {
  if (this.followings.indexOf(user_id) === -1) {
    this.followings.push(user_id)
    await this.save()
  }
}

UserSchema.methods.addFollower = async function(fs) {
  this.followers.push(fs)
  await this.save()
}

UserSchema.methods.data = function(needToken = false) {
  let res = {
    birth: this.birth,
    name: this.name,
    familyName: this.familyName,
    email: this.email,
    post: this.post,
    username: this.username,
    private: this.private,
    followers: this.followers,
    followings: this.followings
  }
  if (needToken)
    res.token = this.token

  return res
}

UserSchema.methods.createToken = function() {
  this.token = jwt.sign({ data: this._id }, process.env.privateKey, { expiresIn: '24h'})
  this.save()
  return this
}

UserSchema.methods.authentification = function(token = null) {
  if (!token)
    return this.createToken()
  console.log(this)
  let res
  try {
    res = jwt.verify(token, process.env.privateKey )
  } catch (e) {
    if (e.name === 'TokenExpiredError')
      return this.createToken()
    else throw e
  }

  if (res.data !== this._id)
    throw new Error('Different users')

  return this
}

UserSchema.methods.deleteUser = () => !this.emailVerified &&
  this.remove()
      .then(user => console.log('utilisateur supprimé, email non vérifié : ' + user.email))

module.exports = mongoose.model('User', UserSchema)
