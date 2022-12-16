const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentScheme = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment_text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const postScheme = new Schema(
  {
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

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
const Comment = mongoose.model("Comment", commentScheme);

module.exports = { Post, Comment };
