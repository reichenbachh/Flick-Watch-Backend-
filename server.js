const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookie = require("cookie-parser");
const db = require("./config/db");
const cors = require("cors");
const errorHanlder = require("./middleware/error");
const User = require("./models/Users");

//load environment variables
dotenv.config({ path: "./config/config.env" });

//initalizing express
const app = express();

//cookie parser
app.use(cookie());

//Json Body parser
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

// Allor cross origin access
app.use(cors(corsOptions));

//mongoDB connection
db();

//route files
const users = require("./routes/user");
const flickList = require("./routes/flickList");

//mounting routes
app.use("/flickApi/v1/auth", users);
app.use("/flickApi/v1/flickList", flickList);
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
  // close server
  server.close(() => process.exit(1));
});
