const mongoose = require('mongoose')
const Device = require('./Device')

const FollowSchema = new mongoose.Schema({
  _id: false,
  user: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ['PENDING', 'OK', 'SENT', 'BLOCK'],
    default: 'OK'
  }
})

const Follow = mongoose.model('Follow', FollowSchema)

const UserSchema = new mongoose.Schema({
  birth: Date,
  creation: { type: Date, default: new Date() },
  devices: [mongoose.Schema.Types.ObjectId],
  email: { type: String, lowercase: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  familyName: { type: String, trim: true },
  followers: [mongoose.Schema.Types.ObjectId],
  followings: [mongoose.Schema.Types.ObjectId],
  name: { type: String, trim: true },
  password: String,
  private: { type: Boolean, default: false },
  token: String,
  username: { type: String, unique: true },
  photo: { type: String, default: "https://res.cloudinary.com/davidshbo/image/upload/v1575582320/default.png" }
})

UserSchema.methods.follow = async function (user_id) {
  if (this.id === user_id)
    return Promise.reject('tu te follow')
  let res = new Follow({ user: user_id })
  this.followings.push(res.id)
  await res.save()
  return this
    .save()
    .then(() => this
      .model('User')
      .findById(user_id))
    .then(user => {
      if (!user)
        return Promise.reject('unknown user')
      user.followers.push(this.id)
      return user.save()
    })
}

UserSchema.methods.addFollower = function (fs) {
  this.followers.push(fs)
  return this.save()
}

UserSchema.methods.data = function () {
  return {
    birth: this.birth,
    email: this.email,
    emailVerified: this.emailVerified,
    familyName: this.familyName,
    followers: this.followers,
    followings: this.followings,
    name: this.name,
    token: this.token,
    username: this.username,
    photo: this.photo
  }
}

UserSchema.methods.trust = function (deviceId, details, trust) {
  if (!deviceId)
    return this.createNewDevice(details, trust, this.id)

  return Device
    .findById(deviceId)
    .exec()
    .then(device => {
      if (!device)
        return this.createNewDevice(device, trust, this.id)
      device.count++
      return device
        .save()
        .then(() => device.id)
    })
}

UserSchema.methods.createNewDevice = async function (device, trusted, user) {
  const res = new Device({ device, trusted, user })
  this.devices.push(res.id)
  await this.save()
  await res.save()
  return res.id
}

module.exports = mongoose.model('User', UserSchema)
