const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Applied"
    },

    // 👇 DATES
    appliedDate: {
      type: Date,
      default: Date.now
    },
    interviewDate: {
      type: Date
    },
    offerDate: {
      type: Date
    },
    rejectedDate: {
      type: Date
    },
 isArchived: {
      type: Boolean,
      default: false   // ✅ THIS FIXES EVERYTHING
    },
followUpDone: {
  type: Boolean,
  default: false
},


    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", JobSchema);
