const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ❗ Stopwords (to avoid junk words)
const STOP_WORDS = new Set([
  "and", "or", "with", "for", "the", "a", "an",
  "experience", "knowledge", "skills", "required",
  "looking", "developer", "engineer", "role"
]);

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      return res.status(400).json({ message: "Job description required" });
    }

    // 📄 Resume text
    const resumeText = (await pdfParse(req.file.buffer))
      .text
      .toLowerCase();

    // 📄 JD text
    const jdText = jobDescription.toLowerCase();

    // 🔍 Extract potential skills dynamically
    const extractKeywords = (text) =>
      [...new Set(
        text
          .replace(/[^a-zA-Z0-9+.#]/g, " ")
          .split(/\s+/)
          .filter(
            (w) =>
              w.length > 2 &&
              !STOP_WORDS.has(w)
          )
      )];

    const jdSkills = extractKeywords(jdText);

    const matched = [];
    const missing = [];

    jdSkills.forEach((skill) => {
      if (resumeText.includes(skill)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const score =
      jdSkills.length === 0
        ? 0
        : Math.round((matched.length / jdSkills.length) * 100);

    // 🎯 Suggestions for missing skills
    const suggestions = missing.map(
      (s) => `Consider adding hands-on projects for ${s}`
    );

    res.json({
      score,
      matched,
      missing,
      totalSkills: jdSkills.length,
      suggestions
    });
  } catch (err) {
    console.error("Resume analyzer error:", err);
    res.status(500).json({ message: "Analysis failed" });
  }
});

module.exports = router;
