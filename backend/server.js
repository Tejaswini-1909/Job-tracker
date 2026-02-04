const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

const jobRoutes = require("./routes/jobRoutes");

const stickyNoteRoutes = require("./routes/stickyNoteRoutes");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/jobs", jobRoutes);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/sticky-notes", stickyNoteRoutes);
app.use("/api/profile", require("./routes/profile"));

app.get("/", (req, res) => {
  res.send("API Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
