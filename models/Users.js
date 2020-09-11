const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Enter a valid email"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [8, " A username has to be more than 8 characters"],
    maxlength: [20, "A username cannot exceed 20 characters"],
  },
  password: {
    type: String,
    required: [true, "please add a password"],
    minlength: [8, "A password cant be less than 8 characters"],
    select: false,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hash Password with bycrypt
UserSchema.pre("save", async function (next) {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

//sign JWT and return
UserSchema.methods.getSignedJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed pasword
UserSchema.methods.matchPassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
