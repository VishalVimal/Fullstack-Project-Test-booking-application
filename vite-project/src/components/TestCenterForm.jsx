import React, { useState } from "react";

function TestCenterForm({ onChange }) {
  const [formData, setFormData] = useState({
    CenterID: "",
    TestCenterName: "",
    Location: "",
    NormalVaccancy: 0,
    AvailableDates: [],
    AvailableSlots: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: name === "NormalVaccancy" ? parseInt(value) : value };
    if (name === "AvailableDates") newData[name] = value.split(",").map((d) => new Date(d.trim()));
    if (name === "AvailableSlots") newData[name] = value.split(",").map((s) => s.trim());
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        name="CenterID"
        placeholder="Center ID"
        value={formData.CenterID}
        onChange={handleChange}
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
        type="text"
        name="TestCenterName"
        placeholder="Test Center Name"
        value={formData.TestCenterName}
        onChange={handleChange}
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
        type="text"
        name="Location"
        placeholder="Location"
        value={formData.Location}
        onChange={handleChange}
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
        type="number"
        name="NormalVaccancy"
        placeholder="Normal Vacancy"
        value={formData.NormalVaccancy}
        onChange={handleChange}
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
        type="text"
        name="AvailableDates"
        placeholder="Available Dates (e.g., 2025-04-01, 2025-04-02)"
        onChange={handleChange}
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
        type="text"
        name="AvailableSlots"
        placeholder="Available Slots (e.g., morning, afternoon)"
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
          borderRadius: "6px",
          border: "1px solid #ddd",
          fontSize: "16px",
        }}
      />
    </div>
  );
}

export default TestCenterForm;