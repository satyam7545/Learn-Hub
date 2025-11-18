const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { status: 'published', isActive: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .sort('-createdAt');

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar bio');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Teacher only)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Teacher - own courses only)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Teacher - own courses only)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/courses/instructor/my-courses
// @desc    Get teacher's courses
// @access  Private (Teacher only)
router.get('/instructor/my-courses', protect, authorize('teacher'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort('-createdAt');

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
