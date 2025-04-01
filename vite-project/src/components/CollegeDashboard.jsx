import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, updateBooking } from "../api";
import BookingForm from "./BookingForm";

function CollegeDashboard({ token, collegeId, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await getProfile("college", token);
        setProfile(profileData || { BookedDates: [] });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile({ BookedDates: [] });
        setError(err.response?.data?.error || "Failed to load college data. Please try again.");
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: ["ExamFees", "AgeLimit", "PreviousYearCutOff", "ExamDuration"].includes(name)
        ? parseInt(value) || 0
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile("college", token, profile);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleBookingUpdate = (newBooking) => {
    const updatedProfile = { ...profile };
    newBooking.TestCenters.forEach((testCenter) => {
      testCenter.BookingDates.forEach((bookingDate) => {
        const existingDate = updatedProfile.BookedDates.find(
          (d) => new Date(d.Date).toDateString() === new Date(bookingDate.Date).toDateString()
        );
        if (existingDate) {
          bookingDate.Slots.forEach((slot) => {
            existingDate.Slots.push({
              Slot: slot.Slot,
              SeatsBooked: slot.SeatsToBook,
              TestCenterId: testCenter.TestCenterId,
              BookingId: newBooking._id,
            });
          });
        } else {
          updatedProfile.BookedDates.push({
            Date: bookingDate.Date,
            Slots: bookingDate.Slots.map((slot) => ({
              Slot: slot.Slot,
              SeatsBooked: slot.SeatsToBook,
              TestCenterId: testCenter.TestCenterId,
              BookingId: newBooking._id,
            })),
          });
        }
      });
    });
    setProfile(updatedProfile);
  };

  const handleEditBooking = (dateIndex, slotIndex) => {
    const slot = profile.BookedDates[dateIndex].Slots[slotIndex];
    setEditingBooking({
      _id: slot.BookingId,
      TestCenters: [
        {
          TestCenterId: slot.TestCenterId,
          BookingDates: [
            {
              Date: profile.BookedDates[dateIndex].Date,
              Slots: [{ Slot: slot.Slot, SeatsToBook: slot.SeatsBooked }],
            },
          ],
        },
      ],
    });
  };

  const handleBookingChange = (e) => {
    const { value } = e.target;
    setEditingBooking((prev) => ({
      ...prev,
      TestCenters: prev.TestCenters.map((tc) => ({
        ...tc,
        BookingDates: tc.BookingDates.map((bd) => ({
          ...bd,
          Slots: bd.Slots.map((slot) => ({
            ...slot,
            SeatsToBook: parseInt(value) || 0,
          })),
        })),
      })),
    }));
  };

  const handleSaveBooking = async () => {
    try {
      await updateBooking(token, editingBooking._id, editingBooking);
      const formattedEditingDate = new Date(
        editingBooking.TestCenters[0].BookingDates[0].Date
      ).toDateString();
      const updatedProfile = { ...profile };
      const dateIndex = updatedProfile.BookedDates.findIndex(
        (d) => new Date(d.Date).toDateString() === formattedEditingDate
      );
      const slotIndex = updatedProfile.BookedDates[dateIndex].Slots.findIndex(
        (s) =>
          s.Slot === editingBooking.TestCenters[0].BookingDates[0].Slots[0].Slot &&
          s.TestCenterId.toString() === editingBooking.TestCenters[0].TestCenterId.toString()
      );
      updatedProfile.BookedDates[dateIndex].Slots[slotIndex].SeatsBooked =
        editingBooking.TestCenters[0].BookingDates[0].Slots[0].SeatsToBook;
      setProfile(updatedProfile);
      setEditingBooking(null);
      alert("Booking updated successfully!");
    } catch (err) {
      alert("Failed to update booking: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  if (!profile) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        fontSize: "24px"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "700",
            background: "linear-gradient(45deg, #00f2fe, #4facfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            College Dashboard
          </h1>
          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              ":hover": {
                background: "rgba(255, 255, 255, 0.2)"
              }
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            Logout
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 0, 0, 0.1)",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "#ff6b6b"
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          marginBottom: "40px"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          }}>
            <h2 style={{
              fontSize: "24px",
              marginBottom: "20px",
              color: "#4facfe"
            }}>College Profile</h2>
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    name="CollegeName"
                    value={profile.CollegeName || ""}
                    onChange={handleChange}
                    placeholder="College Name"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      marginBottom: "10px"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    name="ExamFees"
                    type="number"
                    value={profile.ExamFees || 0}
                    onChange={handleChange}
                    placeholder="Exam Fees"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      marginBottom: "10px"
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      background: "#4facfe",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#3d8fe6"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#4facfe"}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: "10px 20px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ marginBottom: "10px" }}><strong>Name:</strong> {profile.CollegeName || "N/A"}</p>
                <p style={{ marginBottom: "20px" }}><strong>Exam Fees:</strong> ₹{profile.ExamFees || 0}</p>
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: "10px 20px",
                    background: "#4facfe",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#3d8fe6"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#4facfe"}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          }}>
            <h2 style={{
              fontSize: "24px",
              marginBottom: "20px",
              color: "#00f2fe"
            }}>New Booking</h2>
            <BookingForm token={token} collegeId={collegeId} onBookingUpdate={handleBookingUpdate} />
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}>
          <h2 style={{
            fontSize: "24px",
            marginBottom: "20px",
            color: "#4facfe"
          }}>Booked Test Centers</h2>
          {profile.BookedDates.length === 0 ? (
            <p style={{ color: "#a8b2c1" }}>No bookings yet.</p>
          ) : (
            profile.BookedDates.map((booking, dateIndex) => (
              <div
                key={dateIndex}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px"
                }}
              >
                <h3 style={{
                  fontSize: "20px",
                  marginBottom: "15px",
                  color: "#00f2fe"
                }}>
                  {new Date(booking.Date).toLocaleDateString()}
                </h3>
                {booking.Slots.map((slot, slotIndex) => (
                  <div
                    key={slot.Slot}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "10px"
                    }}
                  >
                    <p style={{ marginBottom: "5px" }}>
                      <strong style={{ color: "#4facfe" }}>Test Center:</strong>{" "}
                      {slot.TestCenterId?.TestCenterName || "Unknown"} ({slot.TestCenterId?.Location || "Unknown"})
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#4facfe" }}>Slot:</strong> {slot.Slot}
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#4facfe" }}>Seats Booked:</strong> {slot.SeatsBooked}
                    </p>
                    {editingBooking &&
                      editingBooking._id === slot.BookingId &&
                      editingBooking.TestCenters[0].BookingDates[0].Slots[0].Slot === slot.Slot ? (
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="number"
                          value={editingBooking.TestCenters[0].BookingDates[0].Slots[0].SeatsToBook}
                          onChange={handleBookingChange}
                          style={{
                            padding: "8px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "6px",
                            color: "#fff",
                            width: "100px"
                          }}
                        />
                        <button
                          onClick={handleSaveBooking}
                          style={{
                            padding: "8px 16px",
                            background: "#4facfe",
                            border: "none",
                            borderRadius: "6px",
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#3d8fe6"}
                          onMouseOut={(e) => e.currentTarget.style.background = "#4facfe"}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBooking(null)}
                          style={{
                            padding: "8px 16px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "6px",
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditBooking(dateIndex, slotIndex)}
                        style={{
                          padding: "8px 16px",
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                      >
                        Edit Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CollegeDashboard;