const Router = require("express").Router();
const User = require("../models/user.model");
const { Post, Comment } = require("../models/post.model");

Router.post("/:id", async (req, res) => {
  // for like
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post does not exist" });
    }
    if (req.body.liked) {
      post.likes.push(user._id);
    } else {
      post.likes = post.likes.filter(
        (id) => id._id.toString() !== user._id.toString()
      );
    }
    const newPost = await post.save();
    res.status(201).json({
      status: "success",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
