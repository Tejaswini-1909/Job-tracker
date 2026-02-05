const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const jobRoutes = require("./routes/jobRoutes");
const stickyNoteRoutes = require("./routes/stickyNoteRoutes");

const app = express();

/* ===== Middleware ===== */
app.use(cors({
      origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]

}));
app.use(express.json());

/* ===== DB Connection ===== */
connectDB();

/* ===== Routes ===== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/sticky-notes", stickyNoteRoutes);
app.use("/api/profile", require("./routes/profile"));

/* ===== Health Check ===== */
app.get("/", (req, res) => {
  res.status(200).send("Job Tracker API is running 🚀");
});

/* ===== Server ===== */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
