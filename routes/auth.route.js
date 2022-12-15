const Router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { createToken } = require("../util/token.util");

// register
Router.post("/register", async (req, res) => {
  try {
    const { username, name, password, role } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      password: hashedPassword,
      role,
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

// login
Router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({
      message: "Login successfully",
      status: "success",
      token,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
