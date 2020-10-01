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
  sendResetEmail,
  resetPassword,
} = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getMe", auth, getLoggedInUser);
router.get("/logout", auth, logOutUser);
router.post("/sendResetMail", sendResetEmail);
router.put("/resetPassword/:token", resetPassword);

module.exports = router;
