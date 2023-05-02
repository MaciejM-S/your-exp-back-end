const express = require("express");
const router = new express.Router();
const cors = require("cors");
const authorizate = require("./../middleware/authorization");
const initController = require('../controllers/init')
router.use(cors());
router.use(express.json());

router.get("/init", initController.init );

router.post("/signin", initController.signin );

router.post("/register", initController.register);

router.get("/logout", authorizate, initController.logout );

router.post("/isAuthenticated", initController.isAuthenticated);

router.post("/resetPassword", initController.resetPassword);

module.exports = router;
