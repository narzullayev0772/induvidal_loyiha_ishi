const Router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// get all users
Router.get("/", async (req, res) => {
  try {
    const fromUser = await User.findById(req.userId);
    if (fromUser.role !== "admin" && fromUser.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const users = await User.find({
      role: { $in: ["admin", "user"] },
    });
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// create user
Router.post("/", async (req, res) => {
  try {
    const fromUser = await User.findById(req.userId);
    if (fromUser.role !== "admin" && fromUser.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const userjson = await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      data: userjson,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// get user by id
Router.get("/:id", async (req, res) => {
  try {
    const fromUser = await User.findById(req.userId);
    if (fromUser.role !== "admin" && fromUser.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.params.id);
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// update user
Router.put("/:id", async (req, res) => {
  try {
    const fromUser = await User.findById(req.userId);
    if (fromUser.role !== "admin" && fromUser.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    Object.assign(user, req.body);
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// delete user
Router.delete("/:id", async (req, res) => {
  try {
    const fromUser = await User.findById(req.userId);
    if (fromUser.role !== "admin" && fromUser.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    await user.remove();
    res.status(200).json({
      message: "User deleted successfully",
      data: user,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
