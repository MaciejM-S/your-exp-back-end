const bcrypt = require("bcrypt");
const generateAuthToken = require("./../functions/generateAuthToken");
const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const resetingPasswordEmail = require("./../functions/resetingPasswordEmail");
const crypto = require("crypto");

const errorHandler = (errorCode, next) => {
  const newError = new Error();
  newError.statusCode = errorCode;
  next(newError);
};

exports.init = async (req, res, next) => {
  let user;
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findOne({ id: decoded.id, "tokens.token": token });
  } catch (e) {
    return res.send("notLogged");
  }
  if (user) {
    res.send(user.info.firstName);
  } else {
    res.send("notLogged");
  }
};

exports.signin = async (req, res) => {
  let newToken;
  const user = await User.findOne({ email: req.body.email });
  try {
    await bcrypt.compare(
      req.body.password,
      user.password,
      async function (err, result) {
        if (err) {
          res.send(err);
        }

        if (result) {
          newToken = await generateAuthToken(user._id.toString(), user);
          await user.save();
          return res.send({ newToken });
        } else {
          res.send("incorrect");
        }
      }
    );
  } catch (e) {
    if (e.name === "TypeError") {
      return res.send("incorrect");
    }
  }
};

exports.register = async (req, res, next) => {
  const emailDup = await User.findOne({ email: req.body.email });
  if (emailDup) {
    res.status(200).send({ error: "email exists" });
    return;
  }
  req.body.password = await bcrypt.hash(req.body.password, 8);

  const initProfile = await User.findOne({
    _id: "64510668e1ae2687a9712eac",
  });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    info: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    friends: initProfile.friends,
    posts: initProfile.posts,
  });
  
  try {
    const newToken = await generateAuthToken(user._id.toString(), user);
    await user.save();
    res
      .send({
        newToken,
        email: user.email,
        _id: user._id,
        firstName: user.firstName,
      })
      .status(200);
  
  
  } catch (e) {
    errorHandler(500, next);
  }
  

 
};

exports.logout = async (req, res, next) => {
  try {
    const index = req.user.tokens.findIndex(
      (token) => token.token === req.token
    );
    req.user.tokens.splice(index, 1);
    req.user.save();
    res.send();
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.isAuthenticated = async (req, res) => {
  try {
    const token = req.body.headers.Authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decoded.id, "tokens.token": token });

    if (user) {
      res.send("authenticated");
    } else {
      res.send("notAuthenticated");
    }
  } catch (e) {
    res.send("notAuth");
  }
};

exports.resetPassword = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) {
    res.send("incorrect");
  } else {
    let newPassword;
    try{ crypto.randomBytes(8, async (err, buffer) => {
      if (err) {
        errorHandler(404, next)
      } else {
        newPassword = buffer.toString("hex");
        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();
        resetingPasswordEmail(email, user.info.firstName, newPassword);
        res.send("correct");
      }
    });}catch(e){errorHandler(404, next)}
    
  }
};
