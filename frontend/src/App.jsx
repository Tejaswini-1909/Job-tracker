import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import StickyNotesPage from "./pages/StickyNotesPage";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AuthWrapper from "./pages/AuthWrapper";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      <Navbar token={token} setToken={setToken} />

      {/* push content below fixed navbar */}
      <div style={{ paddingTop: "70px" }}>
        <Routes>
        <Route path="/" element={<AuthWrapper setToken={setToken} />} />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute token={token}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-job"
            element={
              <ProtectedRoute token={token}>
                <AddJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute token={token}>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sticky-notes"
            element={
              <ProtectedRoute token={token}>
                <StickyNotesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
