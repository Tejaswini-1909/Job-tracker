const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 GET USER PROFILE
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// 🔹 UPDATE PROFILE PHOTO
router.post("/photo", auth, upload.single("photo"), async (req, res) => {
  const uploadRes = await cloudinary.uploader.upload_stream(
    { folder: "job-tracker" },
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Upload failed" });

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: result.secure_url },
        { new: true }
      ).select("-password");

      res.json(user);
    }
  );

  uploadRes.end(req.file.buffer);
});
// 🔹 UPDATE NAME
router.put("/update", auth, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("-password");

  res.json(user);
});
const bcrypt = require("bcryptjs");

// 🔹 CHANGE PASSWORD
router.put("/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
