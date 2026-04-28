const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors({
  origin: "*",   // allow all (for testing)
}));

// ================= DB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= SCHEMA =================
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  marks: { type: Number, required: true }
}, { timestamps: true });

// ================= MODEL =================
const Student = mongoose.model("Student", studentSchema);

// ================= ROUTES =================

// ROOT (Fix 404 in browser)
app.get("/", (req, res) => {
  res.send("🚀 API Working Successfully");
});

// CREATE
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const data = await student.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
app.get("/students", async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
app.get("/students/:id", async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not Found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try {
    const data = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});