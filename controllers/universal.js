const express = require('express')
const router = new express.Router()
const cors = require('cors')
const moment = require('moment')
const sharp = require('sharp')
const pushInvitation = require('./../functions/pushInvitation')
const authorizate = require("./../middleware/authorization")
const multer = require('multer')
const User = require("./../models/User")
const Comment = require('./../models/Comment')
const addPost = require('./../functions/addPost')

router.use(cors())
router.use(express.json())
const errorHandler = (errorCode, next) => {
  const newError = new Error();
  newError.statusCode = errorCode;
  next(newError);
};
const generateInvited = require('../functions/personsGenerator')

exports.personsGenerator = async (req, res, next) => {
  try {
    const persons = await generateInvited(req.body)
    res.send(persons)
  } catch (e) { errorHandler(404, next) }
}

exports.sendInvitation = async (req, res, next) => {
  if (!req.body.id) {
    errorHandler(404, next)
  }
  if (req.user.blocked.find(item => {
    return item._id === req.body.id
  })) {
    return res.end('blocked')
  }
  req.user.invitationsSent = await pushInvitation(req.user.invitationsSent, req.body.id)
  await req.user.save()
  const person = await User.findById(req.body.id)
  if (!person) { errorHandler(404, next) }
  person.invitationsRecieved = await pushInvitation(person.invitationsRecieved, req.user._id.toString())
  await person.save()
  res.send()
}

exports.friendsCollection = async (req, res) => {
  let friendsCollection = {}
  friendsCollection._id = req.user._id
  friendsCollection.invitationsSent = req.user.invitationsSent
  friendsCollection.invitationsRecieved = req.user.invitationsRecieved
  friendsCollection.friends = req.user.friends
  friendsCollection.blocked = req.user.blocked
  res.send(friendsCollection)
}

exports.friendsCollectionById = async (req, res, next) => {
  const person = await User.findById({ _id: req.body._id })
  if (!person) { errorHandler(404, next) }
  res.send(person.friends)
}

exports.dismissInvitation = async (req, res, next) => {
  if (req.body._id) { errorHandler(404, next) }
  const index = req.user.invitationsRecieved.findIndex(item => {
    return item._id === req.body._id
  });
  req.user.invitationsRecieved.splice(index, 1)
  await req.user.save()
  const person = await User.findById(req.body._id)
  const personIndex = person.invitationsSent.findIndex(item => {
    return item._id.toString() === req.user._id.toString()
  })
  person.invitationsSent.splice(personIndex, 1)
  await person.save()
  res.send()
}

exports.blockPerson = (req, res, next) => {
  try {
    if (!!req.user.blocked.find(item => {
      return (item._id === req.body._id)
    })) { res.send() }
    else {
      req.user.blocked.push(req.body._id)
    }
    req.user.save()
    res.send()
  } catch (e) { errorHandler(500, next) }

}

exports.stopBlocking = (req, res, next) => {
  const index = req.user.blocked.findIndex(item => {
    return (item._id === req.body._id)
  })

  if (index === -1) { errorHandler(404, next) }

  req.user.blocked.splice(index, 1)
  req.user.save()
  res.send()

}

exports.addComment = async (req, res, next) => {

  const comment = req.body.comment
  const commentsId = req.body.commentsId
  const userComment = await Comment.findOne({ commentsId })

  if (!userComment) { errorHandler(404, next) }

  userComment.comments.push({
    comment: {
      firstName: req.user.info.firstName,
      lastName: req.user.info.lastName,
      avatar: { data: req.user.avatar.data },
      text: comment,
      date: moment().format('LLL'),
    }
  });
  await userComment.save()
  res.send()
}

exports.getComment = async (req, res) => {
  const comments = await Comment.findOne({
    commentsId
      : req.body.commentsId
  })
  res.send(comments)
}

exports.addReaction = async (req, res) => {
  if (req.body.reaction === 'addHeart') {
    const comments = await Comment.findOne({ commentsId: req.body.commentsId })
    const index = comments.hearts.findIndex(id => (id === req.user._id.toString()))
    if (index === -1) {
      comments.hearts.push(req.user._id.toString())
    } else {
      comments.hearts.splice(index, 1)
    }
    await comments.save()
  }

  if (req.body.reaction === 'addThumb') {
    const comments = await Comment.findOne({ commentsId: req.body.commentsId })

    const index = comments.thumbsup.findIndex(id => (id === req.user._id.toString()))

    if (index === -1) {
      comments.thumbsup.push(req.user._id.toString())
    } else {
      comments.thumbsup.splice(index, 1)
    }
    await comments.save()
  }
  res.send()
}

exports.addPost = async (req, res, next) => {

  let picturesForPost = []

  if (!req.files) { errorHandler(404, next) }

  for (let i = 0; i < req.files.length; i++) {

    const buffer = await sharp(req.files[i].buffer).resize({ width: 800 }).toBuffer()

    picturesForPost.push({ data: buffer })
  }

  const postInfo = {}
  postInfo.title = req.body.title
  postInfo.description = req.body.description
  postInfo.range = req.body.range
  await addPost('post', req.user._id, req.user.info, req.user.avatar.data, picturesForPost, req.user.friends, req.user, postInfo)

  res.send()
}


exports.userId = async (req, res) => {
  res.send(req.user._id.toString())
}