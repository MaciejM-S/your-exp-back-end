const express = require("express");
const router = new express.Router();
const cors = require("cors");

const multer = require("multer");

const authorizate = require("./../middleware/authorization");
const profileControllers = require("../controllers/profile");
router.use(cors());
router.use(express.json());

const uploadAvatar = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|svg|jpeg)$/)) {
      return cb(new Error("please upload jpg"));
    }
    cb(undefined, true);
  },
});

const uploadPictures = multer({
  limits: {
    fileSize: 1800000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|svg|jpeg)$/)) {
      return cb(new Error("please upload jpg"));
    }
    cb(undefined, true);
  },
});

router.get("/userPosts", authorizate, profileControllers.userPosts);

router.get("/info", authorizate, async (req, res) => {
  res.send({ user: req.user.info });
});

router.get(
  "/downloadPictures",
  authorizate,
  profileControllers.downloadPictures
);

router.get(
  "/restrictPhotos",
  authorizate,
  profileControllers.getRestrictPhotos
);

router.get("/restrictInfo", authorizate, profileControllers.getRestrictInfo);

router.get("/profilePic", authorizate, profileControllers.profilePic);

router.get("/avatar", authorizate, profileControllers.avatar);

router.get("/userInfo", authorizate, profileControllers.userInfo);

router.post("/saveUserInfo", authorizate, profileControllers.saveUserInfo);

router.post("/findFriends", authorizate, profileControllers.findFriends);

router.post(
  "/uploadProfile",
  authorizate,
  uploadAvatar.single("image"),
  profileControllers.uploadProfile
);

router.post("/changeEmail", authorizate, profileControllers.changeEmail);

router.post("/changePassword", authorizate, profileControllers.changePassword);

router.post("/restrictInfo", authorizate, profileControllers.postRestrictInfo);

router.post(
  "/restrictPhotos",
  authorizate,
  profileControllers.postRestrictPhoto
);

router.post("/allPosts", authorizate, profileControllers.allPosts);

router.post(
  "/uploadPictures",
  authorizate,
  uploadPictures.array("images", 5),
  profileControllers.uploadPictures
);

router.delete("/deletePost", authorizate, profileControllers.deletePost);

router.delete("/deletePicture", authorizate, profileControllers.deletePicture);
module.exports = router;
