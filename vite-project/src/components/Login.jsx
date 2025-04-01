import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login({ role, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login(role, email, password);
      onLogin(data.token, role === "college" ? data.collegeId : data.testCenterId);
      navigate(role === "college" ? "/college-dashboard" : "/test-center-dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "30px"
        }}>
          <div style={{
            fontSize: "40px",
            marginBottom: "15px",
            color: role === "college" ? "#4facfe" : "#00f2fe"
          }}>
            {role === "college" ? "🎓" : "🏢"}
          </div>
          <h2 style={{
            fontSize: "28px",
            color: "#fff",
            marginBottom: "10px",
            fontWeight: "600"
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: "#a8b2c1",
            fontSize: "16px"
          }}>
            Login as {role === "college" ? "College Authority" : "Test Center Manager"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 0, 0, 0.1)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "#ff6b6b",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                ":focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(79, 172, 254, 0.3)"
                }
              }}
              onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px rgba(79, 172, 254, 0.3)"}
              onBlur={(e) => e.target.style.boxShadow = "none"}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                ":focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(79, 172, 254, 0.3)"
                }
              }}
              onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px rgba(79, 172, 254, 0.3)"}
              onBlur={(e) => e.target.style.boxShadow = "none"}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: role === "college" ? "#4facfe" : "#00f2fe",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              marginBottom: "20px"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = role === "college" ? "#3d8fe6" : "#00d4e6"}
            onMouseOut={(e) => e.currentTarget.style.background = role === "college" ? "#4facfe" : "#00f2fe"}
          >
            Login
          </button>

          <p
            onClick={() => navigate("/register")}
            style={{
              color: "#a8b2c1",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "14px",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
            onMouseOut={(e) => e.currentTarget.style.color = "#a8b2c1"}
          >
            Don't have an account? <span style={{ color: role === "college" ? "#4facfe" : "#00f2fe" }}>Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;