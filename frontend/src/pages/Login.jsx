import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function Login({ setToken, switchMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-right">
      <h2>LOGIN</h2>

      <input
        className="auth-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-btn" onClick={handleLogin}>
        LOGIN
      </button>

      <div className="switch-text">
        Don’t have an account?{" "}
        <span onClick={switchMode}>Register</span>
      </div>
    </div>
  );
}

export default Login;
