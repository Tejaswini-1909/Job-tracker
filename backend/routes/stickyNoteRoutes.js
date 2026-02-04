const express = require("express");
const StickyNote = require("../models/StickyNote");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET USER NOTES
router.get("/", auth, async (req, res) => {
  const notes = await StickyNote.find({ user: req.user.id });
  res.json(notes);
});

// CREATE NOTE
router.post("/", auth, async (req, res) => {
  const note = await StickyNote.create({
    user: req.user.id,
    items: req.body.items || []
  });
  res.status(201).json(note);
});

// UPDATE NOTE
router.put("/:id", auth, async (req, res) => {
  const note = await StickyNote.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(note);
});

// DELETE NOTE
router.delete("/:id", auth, async (req, res) => {
  await StickyNote.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  res.json({ message: "Note deleted" });
});

module.exports = router;
