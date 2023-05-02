const express = require("express");
const router = new express.Router();
const cors = require("cors");
const authorizate = require("./../middleware/authorization");
const friendsController = require("../controllers/friends");

router.use(cors());

router.use(express.json());

router.get("/suggestions", authorizate, friendsController.suggestions);

router.post("/personProfile", authorizate, friendsController.personProfile);

router.post("/personPictures", authorizate, friendsController.personPictures);

router.post(
  "/acceptInvitation",
  authorizate,
  friendsController.acceptInvitation
);

router.post("/removePerson", authorizate, friendsController.removePerson);

router.post("/mainSearch", authorizate, friendsController.mainSearch);

module.exports = router;
