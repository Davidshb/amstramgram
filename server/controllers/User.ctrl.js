const User = require('./../models/User')
const Post = require('./../models/Post')
const bcrypt = require('bcryptjs')

module.exports = {

    addUser: (req, res, next = _ => {}) => {
        if(req.body.pwd !== req.body.pwd2)
            return res.status(500).end("pwd!=pwd2")
        let pwd = bcrypt.hashSync(req.body.pwd,10)
        let obj = {
            username: req.body.username,
            name: req.body.fName + " " + req.body.lName,
            private: false,
            password: pwd
        }
        obj.password = bcrypt.hashSync(obj.password,8)
        User.create(obj,(err, newUser) => {
            if (err) throw err
            else if (!newUser)
                res.status(500).send("erreur addUser")
            else
                res.send(newUser)
            next()
        });
    },

    getUser: (req, res, next) => {
        User.findById(req.params.id,'username name email followers following',(err, user)=> {
            if (err)
                res.error(err)
            else if (!user)
                res.status(500).send("erreur getUser")
            else
                res.send(user)
            next()
        })
    },

    // follow un user
    followUser: (req, res, next) => {
        if(req.body.id === req.body.user_id) {
            res.send("tu peux pas te follow")
            return next()
        }
        User.findById(req.body.id,(user) => {
            return user.follow(req.body.user_id).then(() => {
                return res.json({msg: "followed"})
            })
        }).catch(next)
    },

    getUserProfile: (req, res, next) => {
        User.findById(req.params.id,(err,user) => {
            if(err) console.log(err)
            return User.find({'following': req.params.id},(_users)=>{
                _users.forEach((user_)=>{
                    user.addFollower(user_)
                })
                Post.find({'author': req.params.id},(_post)=> {
                    res.json({ user: user, post: _post })
                    next()
                })
            })
        })
    },

    login: (req,res,next) => {
        let {id, type, password} = req.body

        if(type === 1)
            User.findOne({'username': id},'password token',(err,user) => {
                if(err) throw err
                const token = bcrypt.compareSync(password,user.password) ? user.token : null
                return token ? res.send(token) : res.send("bad pwd")
            })
        else if (type === 2)
            User.findOne({'email': id},'password token username name',(err,user) => {
                if(err) throw err
                const token = bcrypt.compareSync(password,user.password) ? user.token : null
                if(!token)
                    res.send("bad pwd")
            })
        res.status(500).send("wtf c'est quel type")
        next()
    },

    verifyUsername: (req,res,next) => {
        if(req.body.param.length < 3 || req.body.param.length > 15 )
            res.status(500).end("Don't touch the pages")
        User.findOne({'username': req.body.param},'username',(user) => {
            if( user === null)
                res.send(true)
            else
                res.send(false)
            next()
        })
    }
}