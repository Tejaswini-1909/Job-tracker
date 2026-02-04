import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function ProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const ref = useRef();

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={styles.avatar}
      >
        {user?.profileImage ? (
          <img src={user.profileImage} alt="profile" style={styles.img} />
        ) : (
          initials
        )}
      </div>

      {open && (
        <div style={styles.menu}>
          <div style={styles.header}>
            <b>{user?.name}</b>
            <small>{user?.email}</small>
          </div>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/resume">Resume Analyzer</Link>
          <Link to="/about">About</Link>

          <hr />
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#ffd966",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold"
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: "50%"
  },
  menu: {
    position: "absolute",
    right: 0,
    top: 50,
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    width: 220,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  header: {
    borderBottom: "1px solid #eee",
    paddingBottom: 8
  }
};
