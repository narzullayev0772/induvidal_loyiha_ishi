const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentScheme = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment_text: {
    type: String,
  },
});

const postScheme = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentScheme],
});

// populate user
postScheme
  .pre("find", function (next) {
    this.populate("user");
    this.populate("comments");
    this.populate("likes");
    next();
  })
  .pre("findOne", function (next) {
    this.populate("user");
    this.populate("comments");
    this.populate("likes");
    next();
  });

const Post = mongoose.model("Post", postScheme);

module.exports = Post;
