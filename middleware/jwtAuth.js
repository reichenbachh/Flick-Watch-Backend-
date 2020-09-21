const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decodedToken.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "access denied",
    });
  }
};
