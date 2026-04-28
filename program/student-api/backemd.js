const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // For parsing JSON requests

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/studentDB';

mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Define Student schema with validation rules
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    age: { type: Number, required: true, min: 1, max: 120 },
    course: { type: String, required: true, enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'] }, // Example courses
    marks: { type: Number, required: true, min: 0, max: 100 }
});

const Student = mongoose.model('Student', studentSchema);

// Create a new student
app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all students, with optional sorting by marks
app.get('/students', async (req, res) => {
    try {
        const { sortByMarks, page = 1, limit = 10 } = req.query;

        let query = Student.find();

        // Sorting based on marks if query param is provided
        if (sortByMarks === 'asc') {
            query = query.sort({ marks: 1 });
        } else if (sortByMarks === 'desc') {
            query = query.sort({ marks: -1 });
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        query = query.skip(skip).limit(parseInt(limit));

        const students = await query.exec();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student (PUT)
app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) return res.status(404).send('Student not found');
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).send('Student not found');
    res.json({ message: 'Student deleted', student: deletedStudent });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Route to get students by department
app.get('/students/department/:dept', async (req, res) => {
    try {
        const department = req.params.dept;
        const students = await Student.find({ course: department });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});