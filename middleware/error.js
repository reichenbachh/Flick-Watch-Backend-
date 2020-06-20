const errorHandler = (err, req, res, next) => {
  //log to console for developer
  console.log(err.stack.red);

  res.status(err.statusCode || 500).json({
    sucess: false,
    error: err.message || "server error",
  });
};

module.exports = errorHandler;
