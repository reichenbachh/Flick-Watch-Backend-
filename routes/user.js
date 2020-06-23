const express = require("express");

//initialize router
const router = express.Router();

//import controllers
const { registerUser, loginUser } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
