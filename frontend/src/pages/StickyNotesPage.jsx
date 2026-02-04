import StickyNotes from "../components/StickyNotes";
import { Link } from "react-router-dom";

function StickyNotesPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.pageCard}>
        {/* ===== HEADER ===== */}
        <div style={styles.header}>
          <h2 style={styles.title}>📝 Sticky Notes</h2>


        </div>

        {/* ===== NOTES AREA ===== */}
        <div  style={styles.content}>
          <StickyNotes />
        </div>
      </div>
    </div>
  );
}

const styles = {
  /* ===== PAGE BACKGROUND WRAPPER ===== */
  wrapper: {
    minHeight: "100vh",
    padding: "40px 20px"
  },

  /* ===== MAIN CARD ===== */
  pageCard: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: 18,
    padding: "25px 30px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
  },

  /* ===== HEADER ===== */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottom: "1px solid #eee",
    paddingBottom: 15
  },

  title: {
    margin: 0,
    color: "#0c5487",
    fontSize: 22
  },

  backBtn: {
    textDecoration: "none",
    background: " #E3F2FD",
    padding: "8px 14px",
    borderRadius: 10,
    color: "#000",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  },

  /* ===== CONTENT ===== */
  content: {
    marginTop: 10
  }
};

export default StickyNotesPage;
