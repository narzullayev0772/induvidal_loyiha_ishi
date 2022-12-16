const Router = require("express").Router();
const User = require("../models/user.model");
const { Post, Comment } = require("../models/post.model");

// get all comments
Router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments");
    if (!post) {
      return res.status(400).json({ message: "Post does not exist" });
    }
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    results.total = post.comments.length;
    results.totalPages = Math.ceil(results.total / limit);
    results.currentPage = page;
    results.next = {
      page: page + 1,
      limit: limit,
    };
    results.previous = {
      page: page - 1,
      limit: limit,
    };
    results.results = post.comments.slice(startIndex, endIndex);
    res.status(200).json({
      message: "Comments fetched successfully",
      data: results,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// create comment by user
Router.post("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post does not exist" });
    }
    const newComment = new Comment({
      comment_text: req.body.comment_text,
      user: req.userId,
    });
    const commentjson = await newComment.save();
    post.comments.push(commentjson._id);
    res.status(201).json({
      message: "Comment created successfully",
      data: commentjson,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
