const Post = require('./../models/Post')
const cloudinary = require('cloudinary')

module.exports = {
    addPost: (req, res, next) => {
        let { likes, description } = req.body
        if (req.files.image) {
            cloudinary.uploader.upload(req.files.image.path, (result) => {
                let obj = { likes, description, feature_img: result.url != null ? result.url : '' }
                savePost(obj)
            },{
                notification_url: document.location.origin + '/notificationPost',
                resource_type: 'image',
                eager: [
                    {effect: 'sepia'}
                ]
            })
        }else
            savePost({ likes, description, feature_img: '' })

        function savePost(obj) {
            Post.create(obj).save((err, post) => {
                if (err)
                    res.send(err)
                else if (!post)
                    res.send(400)
                else {
                    post.addAuthor(req.body.author_id).then((_post) => {
                        console.log("savePost: new " + _post +"\n")
                        res.send(_post)
                    })
                }
                next()
            })
        }
    },

    // récupère tous les post avec les auteurs et les auteurs des commentaires
    getAll: (req, res, next) => {
        Post.find(req.params.id)
            .populate('author')
            .populate('comments.author')
            .exec((err, post)=> {
                if (err)
                    res.send(err)
                else if (!post)
                    res.send(404)
                else
                    res.send(post)
                next()
            })
    },

    //like or unlike un post
    likePost: (req, res, next) => {
        Post.findById(req.body.post_id,(err,post)=> {
            if(err) throw err
            if(req.body.like)
                post.like(req.body.like).then((err,_post)=>{
                    if(err) throw err
                    let msg  = req.body.like ? "Like" : "Unlike"
                    if(!_post)
                        msg = "Not like"
                    res.json({msg})
                })
            next()
        })
    },

    // comment un post
    commentPost: (req, res, next) => {
        Post.findById(req.body.post_id,(err,post)=> {
            if(err) throw err
            return post.comment({
                author: req.body.author_id,
                text: req.body.comment
            }).then(() => {
                res.json({msg: "Done"})
                next()
            })
        })
    },

    //retourne les informations d'un post
    getPost: (req, res, next) => {
        Post.findById(req.params.id)
            .populate('author')
            .populate('comments.author')
            .exec((err, post)=> {
            if (err)
                res.send(err)
            else if (!post)
                res.send(404)
            else
                res.send(post)
            next()
        })
    },

    //efface un commentaire
    removeComment: (req,res,next) => {
        Post.findById(req.body.post_id,(err,_res) => {
            if(err) throw err
            _res.unComment({
                text: req.body.text,
                date: req.body.date,
                author: req.body.author_id
            }).then((__res) => {
                res.send(__res)
                next()
            })
        })
    }
}