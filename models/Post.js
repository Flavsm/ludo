const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  player: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
