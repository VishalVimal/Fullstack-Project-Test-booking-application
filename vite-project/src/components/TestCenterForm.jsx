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

  const formSections = {
    "Center Information": [
      { key: "CenterID", label: "Center ID", type: "text" },
      { key: "TestCenterName", label: "Test Center Name", type: "text" },
      { key: "Location", label: "Location", type: "text" },
      { key: "NormalVaccancy", label: "Normal Vacancy", type: "number" },
    ],
    "Availability": [
      { key: "AvailableDates", label: "Available Dates", type: "text" },
      { key: "AvailableSlots", label: "Available Slots", type: "text" },
    ],
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {Object.entries(formSections).map(([section, fields]) => (
        <div key={section} style={{ marginBottom: "30px" }}>
          <h3 style={{
            fontSize: "18px",
            color: "#00f2fe",
            marginBottom: "15px",
            fontWeight: "600",
            borderBottom: "2px solid rgba(0, 242, 254, 0.2)",
            paddingBottom: "8px"
          }}>
            {section}
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px"
          }}>
            {fields.map(({ key, label, type }) => (
              <div key={key} style={{ position: "relative" }}>
                <label style={{
                  display: "block",
                  color: "#a8b2c1",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {label}
                </label>
                <div style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type={type}
                    name={key}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={formData[key]}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      ":focus": {
                        outline: "none",
                        borderColor: "#00f2fe",
                        boxShadow: "0 0 0 2px rgba(0, 242, 254, 0.1)"
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00f2fe";
                      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0, 242, 254, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {key === "AvailableDates" && (
                  <div style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#a8b2c1",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span style={{ color: "#00f2fe" }}>•</span>
                    Format: YYYY-MM-DD, YYYY-MM-DD
                  </div>
                )}
                {key === "AvailableSlots" && (
                  <div style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#a8b2c1",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span style={{ color: "#00f2fe" }}>•</span>
                    Format: Morning, Afternoon, Evening
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TestCenterForm;