import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [interviewDate, setInterviewDate] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [rejectedDate, setRejectedDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs", {
        company,
        role,
        status,
        appliedDate,
        interviewDate: status === "Interview" ? interviewDate : null,
        offerDate: status === "Offer" ? offerDate : null,
        rejectedDate: status === "Rejected" ? rejectedDate : null
      });

      navigate("/dashboard");
    } catch {
      alert("Failed to add job");
    }
  };

   return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>➕ Add New Job</h2>

        <div style={styles.field}>
          <label style={styles.label}>Company</label>
          <input
            style={styles.input}
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
         <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <input
            style={styles.input}
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Status</label>
          <select
            style={styles.input}
            value={status}
             onChange={(e) => setStatus(e.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Applied Date</label>
          <input
            type="date"
            style={styles.input}
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
                      />
        </div>

        {status === "Interview" && (
          <div style={styles.field}>
            <label style={styles.label}>Interview Date</label>
            <input
              type="date"
              style={styles.input}
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
            />
          </div>
        )}
 {status === "Offer" && (
          <div style={styles.field}>
            <label style={styles.label}>Offer Date</label>
            <input
              type="date"
              style={styles.input}
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              required
            />
          </div>
        )}
          {status === "Rejected" && (
          <div style={styles.field}>
            <label style={styles.label}>Rejected Date</label>
            <input
              type="date"
              style={styles.input}
              value={rejectedDate}
              onChange={(e) => setRejectedDate(e.target.value)}
              required
            />
          </div>
        )}
                <button type="submit" style={styles.submitBtn}>
          ➕ Add Job
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
 form: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    padding: "28px",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    gap: 16
  },

  title: {
    textAlign: "center",
    marginBottom: 10,
     color: " #0c5487"
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555"
  },
   input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 14
  },

  submitBtn: {
    marginTop: 10,
    background: " #0c5487",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default AddJob;