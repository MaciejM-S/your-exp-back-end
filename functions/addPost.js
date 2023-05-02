const User = require("../models/User")
const Comment = require("../models/Comment")
const moment = require("moment")
const mongoose = require('mongoose')



const addPost = async function (type, _id, info, avatar, pictures, friends, user, postInfo) {

  let post

  const commentsId = mongoose.Types.ObjectId();

  if (type === 'profilePic') {

    post = {
      user_id: _id,
      userFirstName: user.info.firstName,
      userLastName: user.info.lastName,
      userAvatar: user.avatar,
      type,
      date: moment().format("MMM Do YY"),
      description: '',
      photos: [{ data: pictures }],
      commentsId,

    }
  }

  if (type === 'pictures') {

    post = {
      user_id: _id,
      userFirstName: user.info.firstName,
      userLastName: user.info.lastName,
      userAvatar: user.avatar,
      type,
      date: moment().format("MMM Do YY"),
      description: '',
      commentsId,
      photos: pictures
    }

  }

  if (type === 'post') {

    post = {
      user_id: _id,
      userFirstName: user.info.firstName,
      userLastName: user.info.lastName,
      userAvatar: user.avatar,
      type,
      date: moment().format("MMM Do YY"),
      description: '',
      commentsId,
      photos: pictures,
      title: postInfo.title,
      description: postInfo.description,
      range: postInfo.range,
    }

  }


  if ((postInfo && postInfo.range === 'friends') || !postInfo) {


    friends.forEach(async friend => {

      const person = await User.findById(friend._id)

      person.posts.push({ post })

      await person.save()

    })
    await user.posts.push({ post })
    await user.save()
  }

  if (postInfo && postInfo.range === 'everybody') {

    const persons = await User.find()


    persons.forEach(async person => {
      person.posts.push({ post })
      await person.save()
    })

  }

  //  create new comment 
  const comment = new Comment()
  comment.commentsId = commentsId
  await comment.save()


}



module.exports = addPost