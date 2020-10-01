const User = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");
const e = require("express");
const sendMail = require("../utils/emailSender");
const { options } = require("../routes/user");
const crypto = require("crypto");

//@register POST
//@route POST flickApi/v1/auth/regitser
//@acess Public
exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    //check if user already exists
    const emailExists = await User.findOne({ username });

    const userNameExists = await User.findOne({ username });

    if (emailExists || userNameExists) {
      console.log(emailExists);
      return next(new ErrorResponse("This account already exists", 401));
    }
    //create User
    const user = await User.create({
      email,
      password,
      username,
    });

    //create token
    const token = user.getSignedJWTtoken();
    sendCookieResponse(200, token, res);
    // res.status(201).json({
    //   success: true,
    //   token,
    // });

    //handle other errors
  } catch (error) {
    next(error);
  }
};
//@register POST
//@route GET flickApi/v1/auth/login
//@acess Public
exports.loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    //Validating request for email and password
    if (!email && !username && !password) {
      return next(
        new ErrorResponse("Please enter an email or username and password", 404)
      );
    }

    //check if user exists
    if (email && password) {
      //check if email exists
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      //check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }

      //create token
      const token = user.getSignedJWTtoken();
      sendCookieResponse(200, token, res);
    } else if (username && password) {
      //check if email exists
      const user = await User.findOne({ username }).select("+password");

      if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      //check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }

      //create token
      const token = user.getSignedJWTtoken();
      sendCookieResponse(200, token, res);
    }
  } catch (error) {
    next(error);
  }
};

exports.logOutUser = async (req, res, next) => {
  sendclearCookiesResponse(200, res);
};

exports.getLoggedInUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.sendResetEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      next(
        new ErrorResponse("Please enter your flick watch email address", 404)
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      next(new ErrorResponse("This user does not exits", 404));
    }

    const token = user.createResetToken();
    const resetUrl = `http://localhost:3000/passwordReset/${token}`;
    user.save({ validateBeforeSave: false });

    try {
      sendMail(email, resetUrl);
    } catch (error) {
      console.log(error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({ validateBeforeSave: false });
    }

    console.log(email);
    res
      .status(200)
      .json({ message: "check your email for a password reset link", token });
  } catch (error) {
    next(error);
  }
};

//reset passwords
exports.resetPassword = async (req, res, next) => {
  try {
    const reqToken = req.params.token;

    //unhashed token is hashed and matched with password stored in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(reqToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      next(
        new ErrorResponse(
          "Invalid token or password reset link has expired",
          404
        )
      );
    }

    //set new password
    const password = req.body.password;

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    const token = user.getSignedJWTtoken();
    sendCookieResponse(200, token, res);
  } catch (error) {
    next(error);
  }
};
//Helper Methods

//clear a cookie
const sendclearCookiesResponse = (statusCode, res) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.clearCookie("token", options).json({
    success: true,
    message: "user logged out",
  });
};

//send signed web token in a cookie
const sendCookieResponse = (statusCode, token, res) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("token", token, options).status(statusCode).json({
    success: true,
    token,
  });
};
