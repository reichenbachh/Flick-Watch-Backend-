const User = require("../models/Users");

//@register POST
//@route GET flickApi/v1/auth/regitser
//@acess Public
exports.registerUser = async (req, res, next) => {
  const { email, userName, password } = req.body;

  try {
    //create User
    const user = await User.create({
      email,
      password,
      userName,
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
      data: error,
    });
  }
};
