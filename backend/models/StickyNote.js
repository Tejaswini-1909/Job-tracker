const mongoose = require("mongoose");

const StickyNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        text: String,
        done: Boolean
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("StickyNote", StickyNoteSchema);
