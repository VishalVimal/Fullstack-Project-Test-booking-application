import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection({ onSelect }) {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    onSelect(role);
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "700",
          marginBottom: "20px",
          background: "linear-gradient(45deg, #00f2fe, #4facfe)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Welcome to Exam Booking
        </h1>
        <p style={{
          fontSize: "24px",
          color: "#a8b2c1",
          marginBottom: "60px",
          lineHeight: "1.6"
        }}>
          Streamline your exam management process with our comprehensive booking system
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap"
        }}>
          <div
            onClick={() => handleRoleSelect("college")}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "40px",
              width: "300px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              ":hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 40px 0 rgba(31, 38, 135, 0.5)"
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 40px 0 rgba(31, 38, 135, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
            }}
          >
            <div style={{
              fontSize: "40px",
              marginBottom: "20px",
              color: "#4facfe"
            }}>🎓</div>
            <h2 style={{
              fontSize: "24px",
              marginBottom: "15px",
              color: "#fff"
            }}>College Authority</h2>
            <p style={{
              color: "#a8b2c1",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              Manage exam schedules and coordinate with test centers
            </p>
          </div>

          <div
            onClick={() => handleRoleSelect("test-center")}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "40px",
              width: "300px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              ":hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 40px 0 rgba(31, 38, 135, 0.5)"
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 40px 0 rgba(31, 38, 135, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
            }}
          >
            <div style={{
              fontSize: "40px",
              marginBottom: "20px",
              color: "#00f2fe"
            }}>🏢</div>
            <h2 style={{
              fontSize: "24px",
              marginBottom: "15px",
              color: "#fff"
            }}>Test Center Manager</h2>
            <p style={{
              color: "#a8b2c1",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              Handle exam bookings and manage test center operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;