const User = require("./../models/User");
const generateResult = require("../functions/generateResult");

const errorHandler = (errorCode, next) => {
  const newError = new Error();
  newError.statusCode = errorCode;
  next(newError);
};

exports.personProfile = async (req, res, next) => {
  try {
    const person = await User.findById(req.body.id.id);
    if (!person) {
      errorHandler(404, next);
    }

    let personForClient = {
      info: {},
    };

    if (
      person.friends.find((friend) => {
        return friend._id.toString() === req.user._id.toString();
      }) ||
      !person.restrictedInfo
    ) {
      personForClient.info = person.info;
      personForClient.profilePic = person.profilePic;
      personForClient._id = person._id;
      res.send(personForClient);
    } else {
      personForClient.info.firstName = person.info.firstName;
      personForClient.info.lastName = person.info.lastName;
      personForClient.profilePic = person.profilePic;
      personForClient._id = person._id;
      res.send(personForClient);
    }
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.personPictures = async (req, res, next) => {
  try {
    const person = await User.findById(req.body.id.id);
    if (!person) {
      errorHandler(404, next);
    }
    let personForClient = {};
    if (
      person.friends.find((friend) => {
        return friend._id.toString() === req.user._id.toString();
      }) ||
      !person.restrictedPhotos
    ) {
      personForClient.pictures = person.pictures;
      res.send(personForClient);
    } else {
      res.send("restricted");
    }
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.acceptInvitation = async (req, res) => {
  const person = await User.findById({ _id: req.body._id });
  if (
    !person.invitationsSent.find((item) => {
      return item._id.toString() === req.user._id.toString();
    })
  ) {
    errorHandler(404, next);
  }
  const indexPerson = person.invitationsSent.findIndex((item) => {
    return item._id.toString() === req.user._id.toString();
  });
  person.invitationsSent.splice(indexPerson, 1);
  const indexUser = req.user.invitationsRecieved.findIndex((item) => {
    return item._id.toString() === person._id.toString();
  });
  req.user.invitationsRecieved.splice(indexUser, 1);
  if (
    !req.user.friends.find(
      (friend) => friend._id.toString() === person._id.toString()
    )
  ) {
    req.user.friends.push(person._id);
    await req.user.save();
  }
  if (
    !person.friends.find(
      (friend) => friend._id.toString() === req.user._id.toString()
    )
  ) {
    person.friends.push(req.user._id);
    await person.save();
  }
  try {
    res.send("accepted");
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.removePerson = async (req, res, next) => {
  
  try{
  const userIndex = req.user.friends.findIndex((item) => {
    return item._id === req.body._id;
  });
  req.user.friends.splice(userIndex, 1);
  const person = await User.findById(req.body._id);
  const personIndex = person.friends.findIndex((item) => {
    return item._id === req.user._id;
  });
  person.friends.splice(personIndex, 1);
  req.user.save();
  person.save();
  res.send("removed");
  }catch(e){errorHandler(500, next)}

};

exports.suggestions = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return errorHandler(404, next);
    }
    let usersForClient = [];

    users.forEach((user) => {
      const isAFriend = req.user.friends.find((friend) => {
        return friend._id.toString() === user._id.toString();
      });

      const isInvited = req.user.invitationsSent.find((friend) => {
        return friend._id.toString() === user._id.toString();
      });

      const isUserAccount = user._id.toString() === req.user._id.toString();

      if (!isAFriend && !isInvited && !isUserAccount) {
        let userForClient = {
          info: {},
        };
        if (!user.restrictedInfo) {
          userForClient.info = user.info;
        }
        if (user.restrictedInfo) {
          userForClient.info.firstName = user.info.firstName;
          userForClient.info.lastName = user.info.lastName;
        }
        userForClient.avatar = user.avatar;
        userForClient._id = user._id.toString();
        usersForClient.push(userForClient);
      }
    });
    res.send(usersForClient);
  } catch (e) {
    return errorHandler(500, next);
  }
};

exports.mainSearch = async (req, res, next) => {
  try{
  const inq = req.body.inq;
  const friends = await generateResult(inq, req.user._id);
  res.send(friends);
  }catch(e){
    errorHandler(500, next)
  }
};
