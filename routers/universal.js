const express = require("express");
const router = new express.Router();
const cors = require("cors");
const authorizate = require("./../middleware/authorization");
const multer = require("multer");

const universalControllers = require("../controllers/universal");
router.use(cors());
router.use(express.json());

const uploadPictures = multer({
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

router.get(
  "/friendsCollection",
  authorizate,
  universalControllers.friendsCollection
);

router.get("/userId", authorizate, universalControllers.userId);

router.post(
  "/personsGenerator",
  authorizate,
  universalControllers.personsGenerator
);

router.post(
  "/sendInvitation",
  authorizate,
  universalControllers.sendInvitation
);

router.post(
  "/friendsCollectionById",
  authorizate,
  universalControllers.friendsCollectionById
);

router.post(
  "/dismissInvitation",
  authorizate,
  universalControllers.dismissInvitation
);

router.post("/blockPerson", authorizate, universalControllers.blockPerson);

router.post("/stopBlocking", authorizate, universalControllers.stopBlocking);

router.post("/addComment", authorizate, universalControllers.addComment);

router.post("/getComments", authorizate, universalControllers.getComment);

router.post("/addReaction", authorizate, universalControllers.addReaction);

router.post(
  "/addPost",
  authorizate,
  uploadPictures.array("images", 5),
  universalControllers.addPost
);

module.exports = router;
