const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

let UserSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	name: String,
	email: {type: String, unique: true},
	password: String,
	token: {type: String, unique: true},
	private: Boolean,
	birth: Date,
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]
})

UserSchema.methods.follow = (user_id) => {
	if (this.following.indexOf(user_id) === -1) {
		this.following.push(user_id)
	}
	return this.save()
}

UserSchema.methods.addFollower = (fs) => {
	this.followers.push(fs)
}

UserSchema.methods.authentification = (data) => {
	return new Promise((resolve, reject) => {
		this.findOne(data, (err, res) => {
			if (err)
				resolve(err)

			this.findOneAndUpdate(res._id, {
				token: jwt.sign({data: res._id}, process.env.privateKey, {expiresIn: '24h'})
			}, (err, user) => {
				if (err)
					reject(err)
				resolve(user)
			})
		})
	})
}

module.exports = mongoose.model('User', UserSchema)