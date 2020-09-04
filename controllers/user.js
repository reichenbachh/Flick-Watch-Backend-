const User = require("../models/Users");
const ErrorResponse = require("../utils/errorHandler");

//@register POST
//@route POST flickApi/v1/auth/regitser
//@acess Public
exports.registerUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    //create User
    const user = await User.create({
      email,
      password,
      username,
    });

    //create token
    const token = user.getSignedJWTtoken();
    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      error,
    });
  }
};
//@register POST
//@route GET flickApi/v1/auth/login
//@acess Public
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  //Validating request for email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter an email and password", 404));
  }

  //check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("User doesnt exist", 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //create token
  const token = user.getSignedJWTtoken();
  res.status(201).json({
    success: true,
    token,
  });
};
