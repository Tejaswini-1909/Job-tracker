import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./AuthAnimated.css";

function AuthWrapper({ setToken }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className={`auth-slider ${mode}`}>
          {/* LOGIN SLIDE */}
          <div className="auth-panel">
            <div className="auth-left">
              <h1>Welcome Back</h1>
              <p>Login to manage your dashboard</p>
            </div>
            <Login
              setToken={setToken}
              switchMode={() => setMode("register")}
            />
          </div>

          {/* REGISTER SLIDE */}
          <div className="auth-panel">
            <div className="auth-left">
              <h1>Hello Friend</h1>
              <p>Create an account and start your journey</p>
            </div>
            <Register switchMode={() => setMode("login")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
