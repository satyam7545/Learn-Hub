const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/attendance
// @desc    Create attendance record
// @access  Private (Teacher only)
router.post('/', protect, authorize('teacher'), async (req, res) => {
  try {
    const { courseId, date, topic, records } = req.body;

    // Verify teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage attendance for this course' });
    }

    const attendance = await Attendance.create({
      course: courseId,
      instructor: req.user.id,
      date,
      topic,
      records
    });

    res.status(201).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/course/:courseId
// @desc    Get attendance records for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate('records.student', 'name email')
      .sort({ date: -1 });

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/my-attendance
// @desc    Get student's attendance records
// @access  Private (Student only)
router.get('/my-attendance', protect, authorize('student'), async (req, res) => {
  try {
    const attendance = await Attendance.find({
      'records.student': req.user.id
    })
      .populate('course', 'title')
      .sort({ date: -1 });

    const myAttendance = [];
    attendance.forEach(record => {
      const studentRecord = record.records.find(
        r => r.student.toString() === req.user.id
      );
      if (studentRecord) {
        myAttendance.push({
          course: record.course,
          date: record.date,
          topic: record.topic,
          status: studentRecord.status,
          remarks: studentRecord.remarks
        });
      }
    });

    res.json({ attendance: myAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance record
// @access  Private (Teacher only)
router.put('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const { records, topic } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (records) attendance.records = records;
    if (topic) attendance.topic = topic;

    await attendance.save();
    res.json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete attendance record
// @access  Private (Teacher only)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
