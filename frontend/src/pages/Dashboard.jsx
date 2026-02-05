import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import DailyAgenda from "../components/DailyAgenda";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingJob, setEditingJob] = useState(null);

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch {
        alert("Failed to load jobs");
      }
    };
    fetchJobs();
  }, []);

  /* ================= DAILY FOLLOW-UP REMINDER ================= */
  useEffect(() => {
    const todayKey = new Date().toDateString();
    if (localStorage.getItem("followupReminder") === todayKey) return;

    jobs.forEach((job) => {
      if (job.isArchived) return;

      if (job.status === "Applied" && job.appliedDate) {
        if (daysPassed(job.appliedDate) >= 7) {
          alert(`🔔 Follow up with ${job.company} (Applied 7+ days ago)`);
        }
      }

      if (job.status === "Interview" && job.interviewDate) {
        if (daysPassed(job.interviewDate) >= 3) {
          alert(`🔔 Follow up after interview with ${job.company}`);
        }
      }
    });

    localStorage.setItem("followupReminder", todayKey);
  }, [jobs]);

  /* ================= HELPERS ================= */
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const daysPassed = (date) =>
    Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

  const getStatusTimeText = (job) => {
    const today = new Date();

    if (job.status === "Interview" && job.interviewDate) {
      const diff = Math.ceil(
        (new Date(job.interviewDate) - today) /
        (1000 * 60 * 60 * 24)
      );
      return diff >= 0
        ? `Interview in ${diff} day(s)`
        : "Interview passed";
    }

    if (job.status === "Rejected" && job.rejectedDate) {
      return `Rejected on ${formatDate(job.rejectedDate)}`;
    }

    if (job.appliedDate) {
      return `Days since applied: ${daysPassed(job.appliedDate)}`;
    }

    return "";
  };

  const getUrgencyColor = (job) => {
    if (job.status === "Interview" && job.interviewDate) {
      const diff = Math.ceil(
        (new Date(job.interviewDate) - new Date()) /
        (1000 * 60 * 60 * 24)
      );
      if (diff <= 1) return "red";
      if (diff <= 3) return "orange";
      return "green";
    }
    if (job.status === "Offer") return "green";
    if (job.status === "Rejected") return "gray";
    return "#0077cc";
  };

  const getUrgencyScore = (job) => {
    if (job.status === "Interview" && job.interviewDate) {
      const diff =
        (new Date(job.interviewDate) - new Date()) /
        (1000 * 60 * 60 * 24);
      if (diff <= 1) return 1;
      if (diff <= 3) return 2;
      return 3;
    }
    if (job.status === "Offer") return 4;
    if (job.status === "Applied") return 5;
    return 6;
  };

  /* ================= CRUD ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await API.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  };

  const handleUpdate = async () => {
    await API.put(`/jobs/${editingJob._id}`, editingJob);
    setJobs(
      jobs.map((j) =>
        j._id === editingJob._id ? editingJob : j
      )
    );
    setEditingJob(null);
  };

  const toggleArchive = async (job) => {
  try {
    const res = await API.patch(`/jobs/${job._id}/archive`);

    setJobs(
      jobs.map((j) =>
        j._id === job._id ? res.data : j
      )
    );
  } catch (err) {
    alert("Archive failed");
  }
};


  /* ================= DAILY AGENDA ================= */
  const today = new Date();
  const isSameDay = (a, b) => a.toDateString() === b.toDateString();

  const agenda = {
    interviewsToday: [],
    interviewsTomorrow: [],
    followUps: [],
    overdue: []
  };

  jobs.forEach((job) => {
    if (job.isArchived) return;

    if (job.status === "Interview" && job.interviewDate) {
      const d = new Date(job.interviewDate);
      if (isSameDay(d, today)) agenda.interviewsToday.push(job);
      else if (d < today) agenda.overdue.push(job);
    }

    if (!job.followUpDone) {
      if (job.status === "Applied" && daysPassed(job.appliedDate) >= 7)
        agenda.followUps.push(job);

      if (
        job.status === "Interview" &&
        job.interviewDate &&
        daysPassed(job.interviewDate) >= 3
      )
        agenda.followUps.push(job);
    }
  });

  // 📊 MONTHLY APPLICATION TREND
  const monthlyApplications = {};

  jobs.forEach((job) => {
    if (!job.appliedDate) return;

    const date = new Date(job.appliedDate);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric"
    });

    monthlyApplications[monthKey] =
      (monthlyApplications[monthKey] || 0) + 1;
  });

  // Convert to array (for rendering)
  const monthlyTrendData = Object.entries(monthlyApplications).map(
    ([month, count]) => ({ month, count })
  );


  /* ================= ANALYTICS ================= */
  const total = jobs.length;
  const interviews = jobs.filter(j => j.status === "Interview").length;
  const offers = jobs.filter(j => j.status === "Offer").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  const interviewRate = total ? Math.round((interviews / total) * 100) : 0;
  const offerRate = total ? Math.round((offers / total) * 100) : 0;


  const exportFilteredJobs = () => {
    // same filter logic as UI
    const filteredJobs = jobs.filter((job) =>
      filter === "Archived"
        ? job.isArchived
        : !job.isArchived &&
        (filter === "All" || job.status === filter)
    );

    if (filteredJobs.length === 0) {
      alert("No jobs to export");
      return;
    }

    const headers = [
      "Company",
      "Role",
      "Status",
      "Applied Date",
      "Interview Date",
      "Offer Date",
      "Rejected Date"
    ];

    const rows = filteredJobs.map((job) => [
      job.company,
      job.role,
      job.status,
      job.appliedDate || "",
      job.interviewDate || "",
      job.offerDate || "",
      job.rejectedDate || ""
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${cell ?? ""}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-tracker-${filter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };


  /* ================= UI ================= */
  return (
    <div style={styles.page}>

      <DailyAgenda
        agenda={agenda}
        onMarkDone={async (id) => {
          await API.put(`/jobs/${id}`, { followUpDone: true });
          setJobs(
            jobs.map(j =>
              j._id === id ? { ...j, followUpDone: true } : j
            )
          );
        }}
      />







      <h2 style={{ color: "#0f0e0ef1" }}>Your Jobs</h2>


      {/* ===== ACTION BAR ===== */}
      <div style={styles.actionBar}>

        <Link to="/sticky-notes" style={styles.stickyBtn}>
          📝 Sticky Notes
        </Link>

        <Link to="/add-job">
          <button style={styles.addBtn}>➕ Add Job</button>
        </Link>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
          <option>Archived</option>
        </select>

        <button
          onClick={exportFilteredJobs}
          style={styles.exportBtn}
        >
          📤 Export CSV
        </button>

      </div>

      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total</span>
          <span style={styles.statValue}>{total}</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Interview Rate</span>
          <span style={styles.statValue}>{interviewRate}%</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Offer Rate</span>
          <span style={styles.statValue}>{offerRate}%</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Rejected</span>
          <span style={styles.statValue}>{rejected}</span>
        </div>
      </div>


      {editingJob && (
        <div style={styles.editOverlay}>
          <div style={styles.editCard}>
            <h3 style={styles.editTitle}>✏️ Edit Job</h3>

            <div style={styles.formGroup}>
              <input
                style={styles.input}
                placeholder="Company"
                value={editingJob.company}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, company: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Role"
                value={editingJob.role}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, role: e.target.value })
                }
              />

              <select
                style={styles.input}
                value={editingJob.status}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, status: e.target.value })
                }
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>

              <label style={styles.label}>Applied Date</label>
              <input
                type="date"
                style={styles.input}
                value={editingJob.appliedDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, appliedDate: e.target.value })
                }
              />

              {editingJob.status === "Interview" && (
                <>
                  <label style={styles.label}>Interview Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={editingJob.interviewDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        interviewDate: e.target.value
                      })
                    }
                  />
                </>
              )}

              {editingJob.status === "Offer" && (
                <>
                  <label style={styles.label}>Offer Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={editingJob.offerDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        offerDate: e.target.value
                      })
                    }
                  />
                </>
              )}

              {editingJob.status === "Rejected" && (
                <>
                  <label style={styles.label}>Rejected Date</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={editingJob.rejectedDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        rejectedDate: e.target.value
                      })
                    }
                  />
                </>
              )}
            </div>

            <div style={styles.editActions}>
              <button onClick={handleUpdate} style={styles.updateBtn}>
                ✅ Update
              </button>
              <button
                onClick={() => setEditingJob(null)}
                style={styles.cancelBtn}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <div style={styles.grid}>
        {jobs
          .filter(job =>
            filter === "Archived"
              ? job.isArchived
              : !job.isArchived &&
              (filter === "All" || job.status === filter)
          )
          .sort((a, b) => getUrgencyScore(a) - getUrgencyScore(b))
          .map((job) => (
            <div key={job._id} style={styles.card}>
              <h3>{job.company}</h3>
              <p>{job.role}</p>

              <span style={{
                background: getUrgencyColor(job),
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 6
              }}>
                {getStatusTimeText(job)}
              </span>

              <p>Interview: {formatDate(job.interviewDate)}</p>

              {!job.isArchived && (
                <>
                  <button onClick={() => setEditingJob(job)} style={{
                    background: "#E3F2FD",
                    color: " #0c5487",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    marginRight: "4px"

                  }}>✏️Edit</button>
                  <button onClick={() => handleDelete(job._id)} style={{
                    background: "#E3F2FD",
                    color: " #0c5487",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    marginRight: "4px"

                  }}>🗑️Delete</button>
                </>
              )}

              <button onClick={() => toggleArchive(job)} style={{
                background: "#E3F2FD",
                color: " #0c5487",
                border: "none",
                padding: "6px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600

              }}>
                {job.isArchived ? "♻️ Restore" : "🗄️ Archive"}
              </button>
            </div>
          ))}
      </div>
    </div>



  );
}

const styles = {


  page: { maxWidth: 900, margin: "40px auto" },



  /* ===== ACTION BAR ===== */
  actionBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,                 // ✅ equal spacing
    flexWrap: "wrap",
    marginBottom: 20
  },

  stickyBtn: {
    background: "#ffe08a",
    padding: "8px 14px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#000",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  },

  addBtn: {
    background: " #0c5487",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  },

  select: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    cursor: "pointer"
  },

  exportBtn: {
    background: "#ffffff",
    border: "1px solid #ccc",
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  },

  /* ===== GRID ===== */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginTop: 20
  },

  card: {

    padding: "18px 20px",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
    border: "1px solid rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"


  },   // ✅ FIXED
  statsCard: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 20,
    background: "#fff6dc",
    padding: "18px 20px",
    borderRadius: 14,
    marginTop: 20,
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
  },


  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    borderRadius: 12,
    padding: "14px 10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  statLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    fontWeight: 600
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: " #0c5487"
  },

  editOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000
  },

  editCard: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
  },

  editTitle: {
    textAlign: "center",
    marginBottom: 20,
    color: " #0c5487"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    marginTop: 6
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 14
  },

  editActions: {
    display: "flex",
    gap: 12,
    marginTop: 24
  },

  updateBtn: {
    flex: 1,
    background: " #0c5487",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer"
  },

  cancelBtn: {
    flex: 1,
    background: "#eeeeee",
    border: "none",
    padding: "10px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer"
  }


};

export default Dashboard;
