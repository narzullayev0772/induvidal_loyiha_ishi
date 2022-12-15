const Router = require("express").Router();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "developer0772",
  api_key: "569715438344253",
  api_secret: "3QFuUAsZGqshB5GAhEz91_5Ymk8",
});
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// upload file
Router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({
      message: "File uploaded successfully",
      data: result,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = Router;
