const express = require("express");
const auth = require("../middleware/jwtAuth");

//initialize router
const router = express.Router();

//import controllers
const {
  registerUser,
  loginUser,
  getLoggedInUser,
  logOutUser,
} = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getMe", auth, getLoggedInUser);
router.get("/logout", auth, logOutUser);

module.exports = router;
