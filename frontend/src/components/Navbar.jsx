import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../api/api";

function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!token || isAuthPage) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [token, isAuthPage]);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  if (!token) return null;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Job Tracker</h3>

      <div style={styles.centerLinks}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/resume">Resume Analyzer</Link>
      </div>

      <div ref={dropdownRef} style={{ position: "relative" }}>
        <div style={styles.avatar} onClick={() => setOpen(!open)}>
          {user?.profileImage ? (
            <img src={user.profileImage} alt="profile" style={styles.avatarImg} />
          ) : (
            initials
          )}
        </div>

        {open && (
          <div style={styles.dropdown}>
            <div style={styles.userInfo}>
              <strong>{user?.name}</strong>
              <div style={styles.email}>{user?.email}</div>
            </div>

            <div style={styles.divider} />

            <Link style={styles.item} to="/about">About</Link>

            <div style={styles.divider} />

            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    padding: "0 30px",
    background: "linear-gradient(135deg, #0c5487,  #0c5487)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
  },
  logo: {
    fontWeight: 700
  },
  centerLinks: {
    display: "flex",
    gap: 25,
    flex: 1,
    justifyContent: "center"
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
    opacity: 0.9
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: " #adcee5",
    color: "#000",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden"
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 52,
    width: 240,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    padding: 12
  },
  userInfo: {
    padding: "6px 10px"
  },
  email: {
    fontSize: 13,
    color: "#777"
  },
  divider: {
    height: 1,
    background: "#eee",
    margin: "8px 0"
  },
  item: {
    display: "block",
    padding: "10px",
    textDecoration: "none",
    color: " #5eb2ee",
    borderRadius: 6,
    fontWeight: 500
  },
  logout: {
    width: "100%",
    padding: "10px",
    border: "none",
    background: "#f3f3f3",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 500
  }
};

export default Navbar;
