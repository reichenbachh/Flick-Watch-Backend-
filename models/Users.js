const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
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
      minlength: [6, " A username has to be more than 8 characters"],
      maxlength: [15, "A username cannot exceed 20 characters"],
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
    passwordResetToken: {
      type: String,
      default: "no token",
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

//Hash Password with bycrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

//sign JWT and return
UserSchema.methods.getSignedJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetToken = hash;

  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

//Match user entered password to hashed pasword
UserSchema.methods.matchPassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
