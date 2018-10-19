const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        username: {type:String, unique: true},
        name: String,
        email: {type: String, unique: true},
        password: String,
        token: {type: String, unique: true, expireAfterSeconds: 3600*24},
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
    }
)

UserSchema.methods.follow = function (user_id) {
    if (this.following.indexOf(user_id) === -1) {
        this.following.push(user_id)
    }
    return this.save()
}

UserSchema.methods.addFollower = function (fs) {
    this.followers.push(fs)
}

module.exports = mongoose.model('User', UserSchema)