import React, { useState } from "react";

function CollegeForm({ onChange }) {
  const [formData, setFormData] = useState({
    CollegeName: "",
    CollegeConductingExamName: "",
    ExamEligibilityQualification: "",
    ExamFees: 0,
    Nationality: "",
    AgeLimit: 0,
    SubjectEligibility: "",
    ProgrammesOffered: "",
    PreviousYearCutOff: 0,
    ExamSyllabus: "",
    SeatAvailablity: "",
    ExamDate: "",
    ExamSlots: [],
    ExamDuration: 0,
    ExamPattern: "",
    ExamType: "",
    ExamMode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: name === "ExamFees" || name === "AgeLimit" || name === "PreviousYearCutOff" || name === "ExamDuration" ? parseInt(value) : value };
    if (name === "ExamSlots") newData[name] = value.split(",").map((s) => s.trim());
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          type={key.includes("Fees") || key.includes("Age") || key.includes("CutOff") || key.includes("Duration") ? "number" : "text"}
          name={key}
          placeholder={key.replace(/([A-Z])/g, " $1").trim()}
          value={formData[key]}
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
      ))}
    </div>
  );
}

export default CollegeForm;