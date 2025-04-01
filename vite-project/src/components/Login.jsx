import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login({ role, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(role, email, password);
      onLogin(data.token, role === "college" ? data.collegeId : data.testCenterId);
      navigate(role === "college" ? "/college-dashboard" : "/test-center-dashboard");
    } catch (err) {
      alert("Login failed: " + err.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "30px", background: "#fff", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "28px", color: "#333", textAlign: "center", marginBottom: "20px" }}>
        Login as {role === "college" ? "College Authority" : "Test Center Manager"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Login
        </button>
      </form>
      <p
        onClick={() => navigate("/register")}
        style={{ color: "#007bff", cursor: "pointer", textAlign: "center", marginTop: "15px" }}
      >
        Don't have an account? Register here
      </p>
    </div>
  );
}

export default Login;