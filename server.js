const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Schemas
const CollegeSchema = new mongoose.Schema({
  CollegeName: String,
  CollegeConductingExamName: String,
  ExamEligibilityQualification: String,
  ExamFees: Number,
  Nationality: String,
  AgeLimit: Number,
  SubjectEligibility: String,
  ProgrammesOffered: String,
  PreviousYearCutOff: Number,
  ExamSyllabus: String,
  SeatAvailablity: String,
  ExamDate: String,
  ExamSlots: [String],
  ExamDuration: Number,
  ExamPattern: String,
  ExamType: String,
  ExamMode: String,
  BookedDates: [
    {
      Date: { type: Date, required: true },
      Slots: [
        {
          Slot: { type: String, required: true },
          SeatsBooked: { type: Number, required: true },
          TestCenterId: { type: mongoose.Schema.Types.ObjectId, ref: "TestCenter", required: true },
          BookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        },
      ],
    },
  ],
});

const TestCenterSchema = new mongoose.Schema({
  TestCenterName: String,
  Location: String,
  NormalVaccancy: Number,
  TotalVaccancy: Number,
  BookingAvailableSeats: [
    {
      BookingDate: { type: Date, required: true },
      Slots: [
        {
          Slot: { type: String, required: true },
          AvailableSeats: { type: Number, required: true },
        },
      ],
    },
  ],
  BookingHistory: [
    {
      CollegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
      BookingDate: Date,
      Slots: [{ Slot: String, SeatsBooked: Number }],
      Timestamp: Date,
    },
  ],
});

const BookingSchema = new mongoose.Schema({
  TestCenters: [{
    TestCenterId: { type: mongoose.Schema.Types.ObjectId, ref: "TestCenter" },
    BookingDates: [{
      Date: Date,
      Slots: [{ Slot: String, SeatsToBook: Number }],
    }],
  }],
  College: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
});

const CollegeExamConductingAuthoritySchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
});

const TestCenterManagerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  testCenterId: { type: mongoose.Schema.Types.ObjectId, ref: "TestCenter" },
});

// Models
const College = mongoose.model("College", CollegeSchema);
const TestCenter = mongoose.model("TestCenter", TestCenterSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const CollegeExamConductingAuthority = mongoose.model("CollegeExamConductingAuthority", CollegeExamConductingAuthoritySchema);
const TestCenterManager = mongoose.model("TestCenterManager", TestCenterManagerSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied: No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  });
};

// College Routes
app.post("/api/college/register", async (req, res) => {
  const { email, password, collegeData } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const college = new College(collegeData);
    await college.save();
    const authority = new CollegeExamConductingAuthority({ email, password: hashedPassword, collegeId: college._id });
    await authority.save();
    res.status(201).json({ message: "College registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register college" });
  }
});

app.post("/api/college/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const authority = await CollegeExamConductingAuthority.findOne({ email });
    if (!authority || !(await bcrypt.compare(password, authority.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: authority._id, role: "college" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, collegeId: authority.collegeId });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/college/profile", authenticateToken, async (req, res) => {
  if (req.user.role !== "college") return res.status(403).json({ error: "Forbidden" });

  try {
    console.log("Fetching profile for user ID:", req.user.id);
    const authority = await CollegeExamConductingAuthority.findById(req.user.id).populate({
      path: "collegeId",
      populate: {
        path: "BookedDates.Slots.TestCenterId",
        select: "TestCenterName Location",
      },
    });

    if (!authority) {
      console.log("No authority found for ID:", req.user.id);
      return res.status(404).json({ error: "College authority not found" });
    }
    if (!authority.collegeId) {
      console.log("No college linked to authority:", authority._id);
      return res.status(404).json({ error: "College not linked to this authority" });
    }

    console.log("Returning college data:", authority.collegeId);
    res.json(authority.collegeId);
  } catch (err) {
    console.error("Error fetching college profile:", err.stack);
    res.status(500).json({ error: "Failed to fetch college profile: " + err.message });
  }
});

app.put("/api/college/update", authenticateToken, async (req, res) => {
  if (req.user.role !== "college") return res.status(403).json({ error: "Forbidden" });
  try {
    const authority = await CollegeExamConductingAuthority.findById(req.user.id);
    const college = await College.findByIdAndUpdate(authority.collegeId, req.body, { new: true });
    res.json(college);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Test Center Routes
app.post("/api/test-center/register", async (req, res) => {
  const { email, password, testCenterData } = req.body;
  try {
    const { NormalVaccancy, AvailableDates, AvailableSlots } = testCenterData;
    const totalVaccancy = NormalVaccancy * AvailableDates.length * AvailableSlots.length;
    const bookingAvailableSeats = AvailableDates.map(date => ({
      BookingDate: date,
      Slots: AvailableSlots.map(slot => ({ Slot: slot, AvailableSeats: NormalVaccancy })),
    }));
    testCenterData.TotalVaccancy = totalVaccancy;
    testCenterData.BookingAvailableSeats = bookingAvailableSeats;
    const testCenter = new TestCenter(testCenterData);
    await testCenter.save();
    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = new TestCenterManager({ email, password: hashedPassword, testCenterId: testCenter._id });
    await manager.save();
    res.status(201).json({ message: "Test Center registered successfully", testCenter });
  } catch (err) {
    console.error("Test center registration error:", err);
    res.status(500).json({ error: "Failed to register test center" });
  }
});

app.post("/api/test-center/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const manager = await TestCenterManager.findOne({ email });
    if (!manager || !(await bcrypt.compare(password, manager.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: manager._id, role: "test-center" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, testCenterId: manager.testCenterId });
  } catch (err) {
    console.error("Test center login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/test-center/profile", authenticateToken, async (req, res) => {
  if (req.user.role !== "test-center") return res.status(403).json({ error: "Forbidden" });
  try {
    const manager = await TestCenterManager.findById(req.user.id).populate("testCenterId");
    res.json(manager.testCenterId);
  } catch (err) {
    console.error("Test center profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/test-center/update", authenticateToken, async (req, res) => {
  if (req.user.role !== "test-center") return res.status(403).json({ error: "Forbidden" });
  try {
    const manager = await TestCenterManager.findById(req.user.id);
    const testCenter = await TestCenter.findByIdAndUpdate(manager.testCenterId, req.body, { new: true });
    res.json(testCenter);
  } catch (err) {
    console.error("Test center update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.get("/api/test-center/availability", authenticateToken, async (req, res) => {
  if (req.user.role !== "test-center") return res.status(403).json({ error: "Forbidden" });
  try {
    const manager = await TestCenterManager.findById(req.user.id).populate("testCenterId");
    const testCenter = manager.testCenterId;
    res.json({
      TotalVaccancy: testCenter.TotalVaccancy,
      BookingAvailableSeats: testCenter.BookingAvailableSeats,
    });
  } catch (err) {
    console.error("Availability error:", err);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

app.get("/api/test-center/bookings", authenticateToken, async (req, res) => {
  if (req.user.role !== "test-center") return res.status(403).json({ error: "Forbidden" });
  try {
    const manager = await TestCenterManager.findById(req.user.id).populate({
      path: "testCenterId",
      populate: { path: "BookingHistory.CollegeId", select: "CollegeName CollegeConductingExamName" },
    });
    res.json(manager.testCenterId.BookingHistory);
  } catch (err) {
    console.error("Booking history error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Booking Route
app.post("/api/bookings", authenticateToken, async (req, res) => {
  if (req.user.role !== "college") return res.status(403).json({ error: "Forbidden" });

  const { TestCenters } = req.body;

  try {
    const authority = await CollegeExamConductingAuthority.findById(req.user.id);
    if (!authority) return res.status(404).json({ error: "College authority not found" });

    const college = await College.findById(authority.collegeId);
    if (!college) return res.status(404).json({ error: "College not found" });

    let booking = new Booking({ TestCenters, Colleges: [authority.collegeId] });

    for (const testCenter of TestCenters) {
      const center = await TestCenter.findById(testCenter.TestCenterId);
      if (!center) {
        return res.status(404).json({ error: `Test Center ${testCenter.TestCenterId} not found` });
      }

      for (const bookingDate of testCenter.BookingDates) {
        const availabilityEntry = center.BookingAvailableSeats.find(
          (entry) => entry.BookingDate.toISOString() === new Date(bookingDate.Date).toISOString()
        );

        if (!availabilityEntry) {
          return res.status(400).json({ error: `No availability for date ${bookingDate.Date}` });
        }

        for (const slot of bookingDate.Slots) {
          const slotEntry = availabilityEntry.Slots.find((s) => s.Slot === slot.Slot);
          if (!slotEntry || slotEntry.AvailableSeats < slot.SeatsToBook) {
            return res.status(400).json({
              error: `Not enough seats in slot ${slot.Slot} on ${bookingDate.Date} (Available: ${slotEntry?.AvailableSeats || 0})`,
            });
          }

          slotEntry.AvailableSeats -= slot.SeatsToBook;
          center.TotalVaccancy -= slot.SeatsToBook;

          center.BookingHistory.push({
            CollegeId: authority.collegeId,
            BookingDate: bookingDate.Date,
            Slots: [{ Slot: slot.Slot, SeatsBooked: slot.SeatsToBook }],
            Timestamp: new Date(),
          });

          const existingDate = college.BookedDates.find(
            (d) => new Date(d.Date).toISOString() === new Date(bookingDate.Date).toISOString()
          );
          if (existingDate) {
            existingDate.Slots.push({
              Slot: slot.Slot,
              SeatsBooked: slot.SeatsToBook,
              TestCenterId: testCenter.TestCenterId,
              BookingId: booking._id,
            });
          } else {
            college.BookedDates.push({
              Date: bookingDate.Date,
              Slots: [{
                Slot: slot.Slot,
                SeatsBooked: slot.SeatsToBook,
                TestCenterId: testCenter.TestCenterId,
                BookingId: booking._id,
              }],
            });
          }
        }
      }
      await center.save();
    }

    await college.save();
    await booking.save();

    res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Existing Routes
app.get("/api/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    console.error("Colleges fetch error:", err);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

app.get("/api/test-centers", async (req, res) => {
  try {
    const centers = await TestCenter.find();
    res.json(centers);
  } catch (err) {
    console.error("Test centers fetch error:", err);
    res.status(500).json({ error: "Failed to fetch test centers" });
  }
});

app.post("/api/colleges", async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json(college);
  } catch (err) {
    console.error("College creation error:", err);
    res.status(500).json({ error: "Failed to create college" });
  }
});

app.post("/api/test-centers", async (req, res) => {
  try {
    const { TestCenterName, Location, NormalVaccancy, AvailableDates, AvailableSlots } = req.body;
    const totalVaccancy = NormalVaccancy * AvailableDates.length * AvailableSlots.length;
    const bookingAvailableSeats = AvailableDates.map(date => ({
      BookingDate: date,
      Slots: AvailableSlots.map(slot => ({ Slot: slot, AvailableSeats: NormalVaccancy })),
    }));

    const testCenter = new TestCenter({
      TestCenterName,
      Location,
      NormalVaccancy,
      TotalVaccancy: totalVaccancy,
      BookingAvailableSeats: bookingAvailableSeats,
      BookingHistory: [],
    });

    await testCenter.save();
    res.status(201).json(testCenter);
  } catch (err) {
    console.error("Test center creation error:", err);
    res.status(500).json({ error: "Failed to create test center" });
  }
});

app.get("/api/college/bookings", authenticateToken, async (req, res) => {
  if (req.user.role !== "college") return res.status(403).json({ error: "Forbidden" });
  try {
    const authority = await CollegeExamConductingAuthority.findById(req.user.id);
    const bookings = await Booking.find({ College: authority.collegeId }).populate({
      path: "TestCenters.TestCenterId",
      select: "TestCenterName Location",
    });
    res.json(bookings);
  } catch (err) {
    console.error("College bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.put("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { TestCenters } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const college = await College.findById(booking.Colleges[0]);

    for (const testCenter of TestCenters) {
      const center = await TestCenter.findById(testCenter.TestCenterId);
      for (const bookingDate of testCenter.BookingDates) {
        const availabilityEntry = center.BookingAvailableSeats.find(
          (entry) => entry.BookingDate.toISOString() === new Date(bookingDate.Date).toISOString()
        );
        for (const slot of bookingDate.Slots) {
          const slotEntry = availabilityEntry.Slots.find((s) => s.Slot === slot.Slot);
          const oldBooking = booking.TestCenters.find((tc) => tc.TestCenterId.toString() === testCenter.TestCenterId.toString());
          const oldDate = oldBooking.BookingDates.find(
            (d) => new Date(d.Date).toISOString() === new Date(bookingDate.Date).toISOString()
          );
          const oldSlot = oldDate.Slots.find((s) => s.Slot === slot.Slot);
          const seatDifference = oldSlot.SeatsToBook - slot.SeatsToBook;

          slotEntry.AvailableSeats += seatDifference;
          center.TotalVaccancy += seatDifference;

          const historyEntry = center.BookingHistory.find(
            (h) =>
              h.CollegeId.toString() === booking.Colleges[0].toString() &&
              new Date(h.BookingDate).toISOString() === new Date(bookingDate.Date).toISOString()
          );
          historyEntry.Slots = historyEntry.Slots.map((s) =>
            s.Slot === slot.Slot ? { ...s, SeatsBooked: slot.SeatsToBook } : s
          );

          const collegeDate = college.BookedDates.find(
            (d) => new Date(d.Date).toISOString() === new Date(bookingDate.Date).toISOString()
          );
          collegeDate.Slots = collegeDate.Slots.map((s) =>
            s.Slot === slot.Slot && s.TestCenterId.toString() === testCenter.TestCenterId.toString()
              ? { ...s, SeatsBooked: slot.SeatsToBook }
              : s
          );
        }
        await center.save();
      }
    }

    booking.TestCenters = TestCenters;
    await booking.save();
    await college.save();

    res.json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error("Booking update error:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});