const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  description: String,
  img: String,
  likes: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String,
      date: Date,
    }
  ]
})

ArticleSchema.methods.like = function (toLike) {
  if (toLike)
    this.likes++
  else
    this.likes--
  return this.save()
}

ArticleSchema.methods.comment = function (c) {
  this.comments.push(c)
  return this.save()
}

ArticleSchema.methods.addAuthor = function (author_id) {
  this.author = author_id
  return this.save()
}

ArticleSchema.methods.getUserArticle = function (_id) {
  this.find({ 'author': _id }).then((article) => {
    return article
  })
}

ArticleSchema.methods.unComment = ({ text, author, date }) => {
  let n = this.comments.findIndex((comment) => {
    return comment.text === text && comment.author === author && comment.date === date
  })

  if (n === -1)
    return false

  this.comments.splice(n, 1)
  return true
}

module.exports = mongoose.model('Article', ArticleSchema)
