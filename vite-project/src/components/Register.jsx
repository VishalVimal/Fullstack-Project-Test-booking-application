import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import CollegeForm from "./CollegeForm";
import TestCenterForm from "./TestCenterForm";

function Register({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(role, { email, password, [role === "college" ? "collegeData" : "testCenterData"]: data });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "30px", background: "#fff", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "28px", color: "#333", textAlign: "center", marginBottom: "20px" }}>
        Register as {role === "college" ? "College Authority" : "Test Center Manager"}
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
        {role === "college" ? <CollegeForm onChange={setData} /> : <TestCenterForm onChange={setData} />}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1e7e34")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;