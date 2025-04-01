import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, getAvailability, getBookingHistory, updateBooking } from "../api";

function TestCenterDashboard({ token, testCenterId, onLogout }) {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [availability, setAvailability] = useState({ TotalVaccancy: 0, BookingAvailableSeats: [] });
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await getProfile("test-center", token);
      const availabilityData = await getAvailability(token);
      const { data: historyData } = await getBookingHistory(token);
      setProfile(profileData.data);
      setAvailability(availabilityData.data);
      setHistory(historyData);
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: name === "NormalVaccancy" || name === "TotalVaccancy" ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile("test-center", token, profile);
    setEditMode(false);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditBooking = (booking) => {
    const bookingData = {
      _id: booking._id || booking.Timestamp, // Use Timestamp if no _id exists
      TestCenters: [
        {
          TestCenterId: testCenterId,
          BookingDates: [
            {
              Date: booking.BookingDate,
              Slots: booking.Slots.map((slot) => ({ Slot: slot.Slot, SeatsToBook: slot.SeatsBooked })),
            },
          ],
        },
      ],
    };
    setEditingBooking(bookingData);
  };

  const handleBookingChange = (e, slotIndex) => {
    const { value } = e.target;
    const updatedBooking = { ...editingBooking };
    updatedBooking.TestCenters[0].BookingDates[0].Slots[slotIndex].SeatsToBook = parseInt(value);
    setEditingBooking(updatedBooking);
  };

  const handleSaveBooking = async () => {
    try {
      await updateBooking(token, editingBooking._id, editingBooking);
      setHistory((prev) =>
        prev.map((b) =>
          new Date(b.BookingDate).toISOString() === new Date(editingBooking.TestCenters[0].BookingDates[0].Date).toISOString()
            ? {
                ...b,
                Slots: editingBooking.TestCenters[0].BookingDates[0].Slots.map((s) => ({
                  Slot: s.Slot,
                  SeatsBooked: s.SeatsToBook,
                })),
              }
            : b
        )
      );
      setEditingBooking(null);
      alert("Booking updated successfully!");
    } catch (err) {
      alert("Failed to update booking: " + err.response.data.error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "28px", color: "#333" }}>Test Center Dashboard</h2>
        <button
          onClick={onLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Logout
        </button>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          {Object.keys(profile).map(
            (key) =>
              key !== "_id" &&
              key !== "__v" &&
              key !== "BookingAvailableSeats" &&
              key !== "BookingHistory" && (
                <input
                  key={key}
                  type={key === "NormalVaccancy" || key === "TotalVaccancy" ? "number" : "text"}
                  name={key}
                  value={profile[key] || ""}
                  onChange={handleChange}
                  placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  style={{
                    width: "100%",
                    padding: "12px",
                    margin: "10px 0",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              )
          )}
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Save
          </button>
        </form>
      ) : (
        <div>
          <p style={{ fontSize: "18px", color: "#555" }}>
            <strong>Center ID:</strong> {testCenterId}
          </p>
          {Object.keys(profile).map(
            (key) =>
              key !== "_id" &&
              key !== "__v" &&
              key !== "BookingAvailableSeats" &&
              key !== "BookingHistory" && (
                <p key={key} style={{ fontSize: "18px", color: "#555" }}>
                  <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {profile[key]}
                </p>
              )
          )}
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Edit Profile
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "22px", color: "#333", marginBottom: "20px" }}>
          Current Availability
        </h3>
        <p style={{ fontSize: "18px", color: "#555" }}>
          <strong>Total Vaccancy:</strong> {availability.TotalVaccancy}
        </p>
        <p style={{ fontSize: "18px", color: "#555" }}>
          <strong>Available Dates:</strong>{" "}
          {availability.BookingAvailableSeats.map((entry) => new Date(entry.BookingDate).toISOString()).join(", ")}
        </p>
        <p style={{ fontSize: "18px", color: "#555" }}>
          <strong>Available Slots:</strong>{" "}
          {availability.BookingAvailableSeats.length > 0
            ? [...new Set(availability.BookingAvailableSeats.flatMap((entry) => entry.Slots.map((slot) => slot.Slot)))].join(", ")
            : "None"}
        </p>
        {availability.BookingAvailableSeats.map((entry) => (
          <div key={entry.BookingDate} style={{ margin: "15px 0" }}>
            <p style={{ fontSize: "16px", color: "#333" }}>
              <strong>Date:</strong> {new Date(entry.BookingDate).toLocaleDateString()}
            </p>
            {entry.Slots.map((slot) => (
              <p key={slot.Slot} style={{ fontSize: "16px", color: "#555", marginLeft: "20px" }}>
                {slot.Slot}: {slot.AvailableSeats} seats available
              </p>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "22px", color: "#333", marginBottom: "20px" }}>
          Booking History
        </h3>
        {history.length === 0 ? (
          <p style={{ fontSize: "16px", color: "#666" }}>No bookings yet.</p>
        ) : (
          history.map((booking) => (
            <div
              key={booking.Timestamp}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleExpand(booking.Timestamp)}
              >
                <p style={{ fontSize: "16px", color: "#333" }}>
                  <strong>College:</strong> {booking.CollegeId.CollegeName} -{" "}
                  {new Date(booking.BookingDate).toLocaleDateString()}
                </p>
                <span>{expanded[booking.Timestamp] ? "▲" : "▼"}</span>
              </div>
              {editingBooking && editingBooking.TestCenters[0].BookingDates[0].Date === booking.BookingDate ? (
                <div style={{ marginTop: "10px" }}>
                  {editingBooking.TestCenters[0].BookingDates[0].Slots.map((slot, slotIndex) => (
                    <input
                      key={slot.Slot}
                      type="number"
                      value={slot.SeatsToBook}
                      onChange={(e) => handleBookingChange(e, slotIndex)}
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
                  <button
                    onClick={handleSaveBooking}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Save Booking
                  </button>
                  <button
                    onClick={() => setEditingBooking(null)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {expanded[booking.Timestamp] && (
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Exam:</strong> {booking.CollegeId.CollegeConductingExamName}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Eligibility:</strong> {booking.CollegeId.ExamEligibilityQualification}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Fees:</strong> {booking.CollegeId.ExamFees}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Nationality:</strong> {booking.CollegeId.Nationality}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Age Limit:</strong> {booking.CollegeId.AgeLimit}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Subject Eligibility:</strong> {booking.CollegeId.SubjectEligibility}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Programmes Offered:</strong> {booking.CollegeId.ProgrammesOffered}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Previous Year Cut Off:</strong> {booking.CollegeId.PreviousYearCutOff}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Syllabus:</strong> {booking.CollegeId.ExamSyllabus}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Seat Availability:</strong> {booking.CollegeId.SeatAvailablity}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Exam Duration:</strong> {booking.CollegeId.ExamDuration} mins
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Pattern:</strong> {booking.CollegeId.ExamPattern}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Type:</strong> {booking.CollegeId.ExamType}
                      </p>
                      <p style={{ fontSize: "16px", color: "#555" }}>
                        <strong>Mode:</strong> {booking.CollegeId.ExamMode}
                      </p>
                      {booking.Slots.map((slot) => (
                        <p
                          key={slot.Slot}
                          style={{ fontSize: "16px", color: "#555", marginLeft: "20px" }}
                        >
                          {slot.Slot}: {slot.SeatsBooked} seats booked
                        </p>
                      ))}
                      <button
                        onClick={() => handleEditBooking(booking)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "16px",
                          marginTop: "10px",
                        }}
                      >
                        Edit Booking
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TestCenterDashboard;