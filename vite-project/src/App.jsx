import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/Login";
import Register from "./components/Register";
import CollegeDashboard from "./components/CollegeDashboard";
import TestCenterDashboard from "./components/TestCenterDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);

  const handleLogin = (newToken, newId) => {
    setToken(newToken);
    setId(newId);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setId(null);
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#f4f7fa", fontFamily: "Arial, sans-serif" }}>
        <Routes>
          <Route path="/" element={<RoleSelection onSelect={setRole} />} />
          <Route
            path="/login"
            element={role ? <Login role={role} onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={role ? <Register role={role} onRegister={() => {}} /> : <Navigate to="/" />}
          />
          <Route
            path="/college-dashboard"
            element={
              token && role === "college" ? (
                <CollegeDashboard token={token} collegeId={id} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/test-center-dashboard"
            element={
              token && role === "test-center" ? (
                <TestCenterDashboard token={token} testCenterId={id} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;