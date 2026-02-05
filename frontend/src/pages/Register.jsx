import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function Register({ switchMode }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-right">
      <h2>REGISTER</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          className="auth-input"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="auth-btn" type="submit">
          REGISTER
        </button>
      </form>

      <div className="switch-text">
        Already have an account?{" "}
        <span onClick={switchMode}>Login</span>
      </div>
    </div>
  );
}

export default Register;
