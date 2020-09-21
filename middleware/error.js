//importing error response class
const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  //log to console for developer
  console.log(err.stack.red);

  let error = { ...err };
  error.message = err.message;

  if (error.code === 11000) {
    const message = `These credentials already exist`;
    res.status(error.statusCode || 500).json({
      sucess: false,
      error: message,
    });
  }
  res.status(error.statusCode || 500).json({
    sucess: false,
    error: error.message || "server error",
  });
  next();
};

module.exports = errorHandler;
