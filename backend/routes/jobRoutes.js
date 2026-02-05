
const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ADD JOB
router.post("/", auth, async (req, res) => {
  try {
    const { company, role, status } = req.body;

    const job = await Job.create({
      company,
      role,
      status,
      user: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET JOBS (JOB LISTING)
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE JOB
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE JOB + AUTO DATE UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { company, role, status, appliedDate, interviewDate, offerDate, rejectedDate } = req.body;

    job.company = company;
    job.role = role;

    // STATUS CHANGE DATE LOGIC
    if (status !== job.status) {
      if (status === "Interview") job.interviewDate = new Date();
      if (status === "Offer") job.offerDate = new Date();
      if (status === "Rejected") job.rejectedDate = new Date();
    }

    // ALLOW MANUAL DATE EDIT
    if (appliedDate) job.appliedDate = appliedDate;
    if (interviewDate) job.interviewDate = interviewDate;
    if (offerDate) job.offerDate = offerDate;
    if (rejectedDate) job.rejectedDate = rejectedDate;

    job.status = status;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

