const express = require("express");

//initialize router
const router = express.Router();

//import controllers
const { registerUser } = require("../controllers/user");

router.post("/register", registerUser);

module.exports = router;
