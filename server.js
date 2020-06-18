const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");

//load environment variables
dotenv.config({ path: "./config/config.env" });

//initalizing express
const app = express();

//Json Body parser
app.use(express.json());

const PORT = process.env.PORT;

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
