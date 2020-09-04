const mongoose = require("mongoose");
const { model } = require("./Users");

const TrackedShowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adult: {
    type: Boolean,
    required: true,
  },
  original_name: {
    type: String,
  },
  runtime: {
    type: String,
  },
  original_language: {
    type: String,
  },
  first_air_date: {
    type: String,
  },
  release_date: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  backdrop_path: {
    type: String,
  },
  release_status: {
    type: Boolean,
    required: true,
  },
  vote_average: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("trackedShows", TrackedShowSchema);
