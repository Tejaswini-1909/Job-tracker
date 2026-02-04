import { useState } from "react";
import API from "../api/api";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please upload resume and paste job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      const res = await API.post("/resume/analyze", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div  style={{
    padding: "40px 30px",
    maxWidth: "820px",
    margin: "40px auto",
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
  }}>
      <h2  style={{
      marginBottom: 20,
      color: "#0c5487",
      textAlign: "center"
    }}>🧠 Resume ↔ Job Match Analyzer</h2>
 <div
    style={{
      background: "#f2f7ff",
      padding: "18px",
      borderRadius: 14,
      marginBottom: 20,
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
    }}
  >
    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
      Upload Resume (PDF)
    </label>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
          style={{
        padding: "8px",
        background: "#ffffff",
        borderRadius: 8,
        border: "1px solid #ccc",
        width: "100%"
      }}
      />
</div>
 <div
    style={{
      background: "#f2f7ff",
      padding: "18px",
      borderRadius: 14,
      marginBottom: 20,
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
    }}
  >
    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
      Job Description
    </label>
      <textarea
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
         style={{
        width: "100%",
        padding: "12px",
        borderRadius: 10,
        border: "1px solid #ccc",
        resize: "vertical",
        fontSize: 14
      }}
      />
</div>
      <button onClick={handleAnalyze}  style={{
      width: "100%",
      padding: "12px",
      background: "#0c5487",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 6px 16px rgba(142,44,95,0.4)"
    }}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <div  style={{
        marginTop: 30,
        background: "#fdfdfd",
        padding: "22px",
        borderRadius: 16,
        boxShadow: "0 10px 28px rgba(0,0,0,0.15)"
      }}>
          <h3 style={{ color: "#0c5487" }}>📊 Match Result</h3>

          <p style={{ fontSize: 16 }}><b>Match Score:</b> {" "}
        <span style={{ color: "#2e7d32", fontWeight: 700 }}>
          {result.score}%
        </span></p>
            <div style={{ marginTop: 16 }}>
          <h4>✅ Matched Skills</h4>
          {result.matched.length > 0 ? (
            <ul>
              {result.matched.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
</div>
<div style={{ marginTop: 16 }}>
          <h4>❌ Missing Skills (Improve these)</h4>
          {result.missing.length > 0 ? (
            <ul>
              {result.missing.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>None 🎉</p>
          )}
</div>
  <div style={{ marginTop: 16 }}>
          <h4>💡 Improvement Suggestions</h4>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
