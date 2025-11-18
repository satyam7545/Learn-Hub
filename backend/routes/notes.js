const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/notes
// @desc    Create note
// @access  Private (Student only)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { title, content, courseId, lesson, tags } = req.body;

    // Verify student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to create notes' });
    }

    const note = await Note.create({
      title,
      content,
      course: courseId,
      student: req.user.id,
      lesson,
      tags
    });

    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notes/course/:courseId
// @desc    Get notes for a course
// @access  Private (Student only)
router.get('/course/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const notes = await Note.find({
      course: req.params.courseId,
      student: req.user.id
    })
      .populate('course', 'title')
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notes/my-notes
// @desc    Get all student's notes
// @access  Private (Student only)
router.get('/my-notes', protect, authorize('student'), async (req, res) => {
  try {
    const notes = await Note.find({ student: req.user.id })
      .populate('course', 'title')
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private (Student only)
router.put('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const { title, content, lesson, tags, isPinned } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (lesson) note.lesson = lesson;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    note.updatedAt = new Date();

    await note.save();
    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private (Student only)
router.delete('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
