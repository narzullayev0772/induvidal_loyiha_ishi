const Router = require("express").Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");

// get all posts
Router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// create post by user
Router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const newPost = new Post({
      ...req.body,
      user: req.userId,
    });
    const postjson = await newPost.save();
    user.posts.push(postjson._id);
    res.status(201).json({
      message: "Post created successfully",
      data: postjson,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// update post if user is owner
Router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post does not exist" });
    }
    if (post.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// delete post if user is owner
Router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Post does not exist" });
    }
    if (post.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Post deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
