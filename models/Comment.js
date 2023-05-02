const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  commentsId: { type: String },
  comments: [{
    comment: {
      firstName: { type: String },
      lastName: { type: String },
      avatar:
      {
        data:
          { type: Buffer },
      },
      text: { type: String },
      date: { type: String }
    }
  }],
  hearts:[{
    type: String,
  }],
  thumbsup: [{
    type: String,
  }]


})



const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment