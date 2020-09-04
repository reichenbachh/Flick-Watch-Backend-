const mongoose = require("mongoose");

const TrackedMovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  runtime: {
    type: String,
  },
  adult: {
    type: Boolean,
    required: true,
  },
  vote_average: {
    type: Number,
  },
  releaseStatus: {
    type: Boolean,
    required: true,
  },
  language: {
    type: String,
  },
});

module.exports = mongoose.model("TrackedMovie", TrackedMovieSchema);
