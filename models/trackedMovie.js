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
  air_date: { type: String },
  vote_average: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  backdrop_path: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TrackedMovieSchema;
