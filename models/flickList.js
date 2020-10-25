const mongoose = require("mongoose");
const trackedShow = require("./trackedShow");
const trackedMovie = require("./trackedMovie");

const flickListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieList: [trackedMovie],
  showList: [trackedShow],
});

module.exports = mongoose.model("flickList", flickListSchema);
