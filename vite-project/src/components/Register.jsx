import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import CollegeForm from "./CollegeForm";
import TestCenterForm from "./TestCenterForm";

function Register({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(role, { email, password, [role === "college" ? "collegeData" : "testCenterData"]: data });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
        maxWidth: "600px",
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
            Create Account
          </h2>
          <p style={{
            color: "#a8b2c1",
            fontSize: "16px"
          }}>
            Register as {role === "college" ? "College Authority" : "Test Center Manager"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 0, 0, 0.1)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "#ff6b6b",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              color: "#a8b2c1",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                position: "absolute",
                left: "12px",
                color: "#a8b2c1",
                fontSize: "18px"
              }}>
                ✉️
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
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
                onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(79, 172, 254, 0.3)"}
                onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
              />
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              color: "#a8b2c1",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Password
            </label>
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                position: "absolute",
                left: "12px",
                color: "#a8b2c1",
                fontSize: "18px"
              }}>
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
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
                onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(79, 172, 254, 0.3)"}
                onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  color: "#a8b2c1",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "18px",
                  transition: "color 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                onMouseOut={(e) => e.currentTarget.style.color = "#a8b2c1"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#a8b2c1",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>💡</span>
              Password must be at least 8 characters long
            </div>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px"
          }}>
            {role === "college" ? <CollegeForm onChange={setData} /> : <TestCenterForm onChange={setData} />}
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
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = role === "college" ? "#3d8fe6" : "#00d4e6"}
            onMouseOut={(e) => e.currentTarget.style.background = role === "college" ? "#4facfe" : "#00f2fe"}
          >
            <span>✨</span>
            Create Account
          </button>

          <p
            onClick={() => navigate("/login")}
            style={{
              color: "#a8b2c1",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "14px",
              transition: "color 0.3s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
            onMouseOut={(e) => e.currentTarget.style.color = "#a8b2c1"}
          >
            Already have an account? <span style={{ color: role === "college" ? "#4facfe" : "#00f2fe" }}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;