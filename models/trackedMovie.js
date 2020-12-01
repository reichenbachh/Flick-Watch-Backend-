const mongoose = require("mongoose");

const TrackedMovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tmdb_id: {
    type: String,
    required: true,
  },
  media_type: { type: String, default: "movie" },
  language: { type: String, default: "none" },
  release_date: { type: String, default: "none" },
  vote_average: { type: String },
  poster_path: { type: String },
  backdrop_path: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TrackedMovieSchema;
