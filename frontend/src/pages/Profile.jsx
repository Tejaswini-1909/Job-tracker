import { useEffect, useState } from "react";
import API from "../api/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  /* ================= UPLOAD PHOTO ================= */
  const uploadPhoto = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("photo", file);
      await API.post("/profile/photo", formData);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Photo upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  }

  /* ================= INITIALS (SAME AS BEFORE) ================= */
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div style={styles.page}>
      <h2>👤 My Profile</h2>

      {/* PROFILE AVATAR */}
      <div style={styles.avatarWrapper}>
        {user.photo ? (
          <img src={user.photo} alt="Profile" style={styles.avatarImg} />
        ) : (
          <div style={styles.avatarFallback}>{initials}</div>
        )}
      </div>

      {/* UPLOAD PHOTO */}
      <div style={{ marginTop: 15 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button onClick={uploadPhoto} disabled={loading} style={styles.button}>
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>

      {/* USER DETAILS */}
      <div style={styles.card}>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> Job Seeker</p>
      </div>

      {/* FUTURE FEATURES */}
      <div style={styles.note}>
        <h4>🔒 Coming Soon</h4>
        <ul>
          <li>Change password</li>
          <li>Resume history</li>
          <li>Account security settings</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "600px",
    margin: "90px auto",
    padding: "20px",
    textAlign: "center"
  },
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20
  },
  avatarImg: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc"
  },
  /* 🔵 SAME BLUE FALLBACK AS BEFORE */
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "#0077cc",
    color: "#fff",
    fontSize: "36px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    marginTop: 25,
    padding: 15,
    background: "#f5f5f5",
    borderRadius: 8,
    textAlign: "left"
  },
  button: {
    marginTop: 10,
    padding: "8px 16px",
    background: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  note: {
    marginTop: 30,
    background: "#fffbe6",
    padding: 15,
    borderRadius: 8,
    textAlign: "left"
  }
};

export default Profile;
