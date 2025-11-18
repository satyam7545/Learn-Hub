const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private (Student only)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get student's enrolled courses
// @access  Private (Student only)
router.get('/my-courses', protect, authorize('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email avatar' }
      })
      .sort('-enrolledAt');

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/enrollments/course/:courseId
// @desc    Get enrollment details for a specific course
// @access  Private (Student only)
router.get('/course/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/enrollments/:id/progress
// @desc    Update course progress
// @access  Private (Student only)
router.put('/:id/progress', protect, authorize('student'), async (req, res) => {
  try {
    const { videoId, progress } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add video to completed videos if not already there
    if (videoId && !enrollment.completedVideos.includes(videoId)) {
      enrollment.completedVideos.push(videoId);
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = progress;
    }

    // Update last accessed video
    if (videoId) {
      enrollment.lastAccessedVideo = videoId;
    }

    // Mark as completed if progress is 100%
    if (progress >= 100 && !enrollment.completedAt) {
      enrollment.completedAt = Date.now();
      enrollment.certificateIssued = true;
    }

    await enrollment.save();

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/enrollments/course/:courseId/students
// @desc    Get students enrolled in a course
// @access  Private (Teacher only)
router.get('/course/:courseId/students', protect, authorize('teacher'), async (req, res) => {
  try {
    // Verify teacher owns the course
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this course students' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar');

    const students = enrollments.map(enrollment => enrollment.student);
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
