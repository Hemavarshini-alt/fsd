const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
  name: String,
  department: String,
  marks: Number
});

const Student = mongoose.model("Student", studentSchema);

// Root route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// GET all students
app.get("/students", async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const data = await student.save();
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT
app.put("/students/:id", async (req, res) => {
  try {
    const data = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});