const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    userId: {
    type: String,
    required: true,
  },  
  password: {
    type: String,
    required: true,
  },
    comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
});

module.exports = mongoose.model("comment", commentSchema);