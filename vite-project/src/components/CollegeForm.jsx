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

  const formSections = {
    "Basic Information": [
      { key: "CollegeName", label: "College Name", type: "text" },
      { key: "CollegeConductingExamName", label: "Exam Name", type: "text" },
      { key: "ExamEligibilityQualification", label: "Eligibility Qualification", type: "text" },
      { key: "Nationality", label: "Nationality", type: "text" },
      { key: "AgeLimit", label: "Age Limit", type: "number" },
    ],
    "Exam Details": [
      { key: "ExamFees", label: "Exam Fees (₹)", type: "number" },
      { key: "PreviousYearCutOff", label: "Previous Year Cut Off", type: "number" },
      { key: "ExamDuration", label: "Exam Duration (minutes)", type: "number" },
      { key: "ExamPattern", label: "Exam Pattern", type: "text" },
      { key: "ExamType", label: "Exam Type", type: "text" },
      { key: "ExamMode", label: "Exam Mode", type: "text" },
    ],
    "Program Information": [
      { key: "SubjectEligibility", label: "Subject Eligibility", type: "text" },
      { key: "ProgrammesOffered", label: "Programmes Offered", type: "text" },
      { key: "ExamSyllabus", label: "Exam Syllabus", type: "text" },
      { key: "SeatAvailablity", label: "Seat Availability", type: "text" },
    ],
    "Schedule Information": [
      { key: "ExamDate", label: "Exam Date", type: "date" },
      { key: "ExamSlots", label: "Exam Slots", type: "text" },
    ],
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {Object.entries(formSections).map(([section, fields]) => (
        <div key={section} style={{ marginBottom: "30px" }}>
          <h3 style={{
            fontSize: "18px",
            color: "#4facfe",
            marginBottom: "15px",
            fontWeight: "600",
            borderBottom: "2px solid rgba(79, 172, 254, 0.2)",
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
                        borderColor: "#4facfe",
                        boxShadow: "0 0 0 2px rgba(79, 172, 254, 0.1)"
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4facfe";
                      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(79, 172, 254, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {key === "ExamSlots" && (
                  <div style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#a8b2c1",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span style={{ color: "#4facfe" }}>•</span>
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

export default CollegeForm;