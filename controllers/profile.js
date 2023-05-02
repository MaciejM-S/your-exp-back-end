const express = require("express");
const router = new express.Router();
const cors = require("cors");

const moment = require("moment");
const sharp = require("sharp");

const User = require("./../models/User");
router.use(cors());
router.use(express.json());

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const addPost = require("./../functions/addPost");

const generateResult = require("./../functions/generateResult");

const deletePictureById = async (idPic, idUser) => {
  const user = await User.findById(idUser);

  let pictures;

  if (idPic === "profile") {
    user.profilePic = {};
    await user.save();
    pictures = user.pictures;
  } else {
    pictures = user.pictures.filter((picture) => {
      return picture._id.toString() !== idPic.toString();
    });
  }
  return pictures;
};

const errorHandler = (errorCode, next) => {
  const newError = new Error();
  newError.statusCode = errorCode;
  next(newError);
};

exports.uploadProfile = async (req, res, next) => {
  try {
    req.user.avatar.data = await sharp(req.file.buffer)
      .resize({ width: 150 })
      .toBuffer();
    req.user.avatar.date = moment().format("MMM DD YYYY");

    req.user.profilePic.data = await sharp(req.file.buffer)
      .resize({ width: 400 })
      .toBuffer();
    req.user.profilePic.date = moment().format("MMM DD YYYY");

    await addPost(
      "profilePic",
      req.user._id,
      req.user.info,
      req.user.avatar.data,
      req.user.profilePic.data,
      req.user.friends,
      req.user
    );

    await req.user.save();
    res.send();
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.uploadPictures = async (req, res, next) => {
  let picturesForPost = [];
  try {
    for (let i = 0; i < req.files.length; i++) {
      const buffer = await sharp(req.files[i].buffer)
        .resize({ width: 400 })
        .toBuffer();

      picturesForPost.push({ data: buffer });

      req.user.pictures = req.user.pictures.concat({
        picture: { data: buffer },
      });
    }

    await addPost(
      "pictures",
      req.user._id,
      req.user.info,
      req.user.avatar.data,
      picturesForPost,
      req.user.friends,
      req.user
    );

    await req.user.save();
    res.send();
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.deletePicture = async (req, res) => {
  req.user.pictures = await deletePictureById(req.body.id, req.user._id);
  await req.user.save();
  res.send();
};

exports.downloadPictures = async (req, res) => {
  try {
    const result = await req.user.pictures;
    res.set("Content-Type", "image/jpeg");
    res.json(result);
  } catch (error) {
    res.status(400).send({ get_error: "Error while getting photo." });
  }
};

exports.profilePic = async (req, res) => {
  try {
    const result = await req.user;
    res.set("Content-Type", "image/jpeg");
    res.json(result.profilePic);
  } catch (error) {
    res.status(400).send({ get_error: "Error while getting photo." });
  }
};

exports.avatar = async (req, res) => {
  try {
    res.send({ avatar: req.user.avatar, info: req.user.info });
  } catch (error) {
    res.status(400).send({ get_error: "Error while getting photo." });
  }
};

exports.userInfo = async (req, res) => {
  res.send(req.user.info);
};

exports.saveUserInfo = async (req, res, next) => {
  try {
    req.user.info = req.body;
    await req.user.save();
    res.sendStatus(200);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.findFriends = async (req, res, next) => {
  try {
    const inq = req.body.searchInquiry;
    const friends = await generateResult(inq, req.user._id);
    res.send(friends);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.user.password,
      async function (err, result) {
        if (err) {
        }
        if (result) {
          req.user.email = req.body.newEmail;
          await req.user.save();
          res.send("emailChanged");
        } else {
          res.send("wrongPassword");
        }
      }
    );
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.changePassword = async (req, res, next) => {
  const result = await bcrypt.compare(
    req.body.password,
    req.user.password,
    async function (err, result) {
      if (err) {
        errorHandler(404, next);
      }
      if (result) {
        req.user.password = await bcrypt.hash(req.body.newPassword, 8);
        await req.user.save();
        res.send("passwordChanged");
      } else {
        res.send("wrongPassword");
      }
    }
  );
};

exports.getRestrictInfo = async (req, res, next) => {
  try {
    res.send(req.user.restrictedInfo);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.postRestrictInfo = async (req, res, next) => {
  try {
    req.user.restrictedInfo = req.body.value;
    await req.user.save();
    res.send(req.user.restrictedInfo);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.getRestrictPhotos = async (req, res, next) => {
  try {
    res.send(req.user.restrictedPhotos);
  } catch (e) {
    errorHandler(404, next);
  }
};
exports.postRestrictPhoto = async (req, res, next) => {
  try {
    req.user.restrictedPhotos = req.body.value;
    await req.user.save();
    res.send(req.user.restrictedPhotos);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.userPosts = async (req, res,next) => {
  let userPosts = [];
  try {
    userPosts = req.user.posts.filter((post) => {
      return post.post.user_id.toString() === req.user._id.toString();
    });
    res.send(userPosts);
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.allPosts = async (req, res, next) => {
  try {
    const person = await User.findOne({
      _id: req.body.id || req.user._id.toString(),
    });
    let currentPage = req.body.currentPage;
    if (req.body.currentPage) {
      fetchedPosts = person.posts
        .reverse()
        .slice((currentPage - 1) * 2, currentPage * 2);
      res.send({
        posts: fetchedPosts,
        _id: req.user._id,
        currentPage: req.body.currentPage + 1,
        hasMore: currentPage * 2 < person.posts.length,
      });
    } else {
      res.send({ posts: person.posts, _id: req.user._id });
    }
  } catch (e) {
    errorHandler(404, next);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const commentsId = req.body.commentsId;
    const index = req.user.posts.findIndex(
      (post) => post.post.commentsId === commentsId
    );
    req.user.posts.splice(index, 1);
    await req.user.save();
    res.send();
  } catch (e) {
    errorHandler(404, next);
  }
};
