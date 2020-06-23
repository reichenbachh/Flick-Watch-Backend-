const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const db = require("./config/db");
const errorHanlder = require("./middleware/error");

//load environment variables
dotenv.config({ path: "./config/config.env" });

//initalizing express
const app = express();

//Json Body parser
app.use(express.json());

//mongoDB connection
db();

//route files
const users = require("./routes/user");

//mounting routes
app.use("/flickApi/v1/auth", users);

//error handler
app.use(errorHanlder);

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running on port ${PORT} in ${process.env.NODE_ENV} mode`.green.bold
      .underline
  )
);

//Handle unhandled rejections
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error : ${error.message}`.red);
  //close server
  server.close(() => process.exit(1));
});
