const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/assignments
// @desc    Create assignment
// @access  Private (Teacher only)
router.post('/', protect, authorize('teacher'), async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxScore, fileUrl } = req.body;

    // Verify teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create assignments for this course' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      instructor: req.user.id,
      dueDate,
      maxScore,
      fileUrl
    });

    res.status(201).json({ assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/assignments/course/:courseId
// @desc    Get assignments for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('instructor', 'name email')
      .sort({ dueDate: -1 });

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment
// @access  Private (Student only)
router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { fileUrl, text } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Already submitted' });
    }

    assignment.submissions.push({
      student: req.user.id,
      fileUrl,
      text,
      submittedAt: new Date()
    });

    await assignment.save();
    res.json({ message: 'Assignment submitted successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/assignments/:id/grade/:submissionId
// @desc    Grade assignment submission
// @access  Private (Teacher only)
router.put('/:id/grade/:submissionId', protect, authorize('teacher'), async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.gradedAt = new Date();

    await assignment.save();
    res.json({ message: 'Assignment graded successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/assignments/my-submissions
// @desc    Get student's assignments and submissions
// @access  Private (Student only)
router.get('/my-submissions', protect, authorize('student'), async (req, res) => {
  try {
    // Get all courses the student is enrolled in
    const enrollments = await Enrollment.find({ student: req.user.id });
    const courseIds = enrollments.map(e => e.course);

    // Get all assignments for those courses
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .populate('instructor', 'name')
      .sort({ dueDate: -1 });

    const submissions = [];
    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(
        s => s.student.toString() === req.user.id
      );
      
      submissions.push({
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          maxScore: assignment.maxScore,
          fileUrl: assignment.fileUrl,
          course: assignment.course,
          instructor: assignment.instructor
        },
        submission: submission || null
      });
    });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private (Teacher only)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
